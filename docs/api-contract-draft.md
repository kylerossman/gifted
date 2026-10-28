# Gifted API Contract Draft

This document is an app-first proposal for the Gifted data model and REST API. It is intended to be the baseline that the frontend and Java/Spring backend can implement together. It is deliberately a set of examples and conventions, not a formal JSON Schema. Revise it as implementation reveals better choices.

The paths below are proposed. The dashboard reads people and events from their collection endpoints; gift ideas are a separate resource collection and are associated with people and optionally events by ID.

## Conventions to start with

- Use JSON with `Content-Type: application/json`.
- Use lower camelCase property names.
- Represent IDs as UUID strings.
- Represent timestamps as ISO 8601 UTC strings, such as `2026-10-22T14:30:00Z`.
- Represent all-day event dates as `YYYY-MM-DD`, such as `2026-12-25`. Use a date-time only if the event time itself matters.
- Omit optional fields when unknown. Use `null` only when the API needs to explicitly clear a value or distinguish “known to be empty” from “not supplied.”
- Keep relationships as IDs rather than embedding copies of related records. That avoids duplicated, stale data and lets the API return a compact resource.
- Store image references as `imageUrl`. Upload image bytes separately; do not put blobs/base64 in normal JSON payloads.
- Represent money as integer minor units plus an ISO 4217 currency code. For example, USD 129.99 is `{ "amountMinor": 12999, "currency": "USD" }`, avoiding floating-point rounding.
- Treat these examples as unauthenticated development requests. Add authentication and authorization rules when those requirements are known.

## Resource shapes

### User profile

A user profile represents the authenticated account owner. Keep this safe profile resource separate from authentication credentials: profile responses must never contain a password or password hash.

```json
{
  "id": "672a9b5b-8357-4575-9d8b-7ca732f4c1be",
  "firstName": "Jordan",
  "lastName": "Taylor",
  "email": "jordan@example.com",
  "phoneNumber": "+14155552671",
  "imageUrl": "https://example.com/images/jordan.jpg",
  "friendIds": [],
  "createdAt": "2026-10-22T14:30:00Z",
  "updatedAt": "2026-10-22T14:30:00Z"
}
```

Use `phoneNumber` as a string (preferably normalized to E.164) so a leading `+` and zeroes are preserved. Use `imageUrl` as a remote reference; upload image bytes through a separate upload flow rather than putting a blob or base64 value in profile JSON. Responses should include `friendIds: []` when there are no connected users.

`friendIds` refers only to other `User` account IDs connected to this account. It is not a list of the `Person` records this user created to track gift ideas: a `Person` is a private address-book-like record, while a connected user is an account. Friend invitation, acceptance, and removal should be separate relationship operations; do not allow arbitrary profile updates to write another user's ID into this list.

Email is a string in the JSON model. The server should validate a reasonable email syntax and uniqueness, and verify ownership as part of account registration or email changes. Avoid relying on a strict client-side regex as proof that an address is valid or deliverable.

The password is not part of `UserProfile`, `RegisterUserDto` responses, or `UpdateUserProfileDto`. It may appear only in an authentication request such as account registration or login. Send credentials only over HTTPS, hash passwords on the server with a modern password-hashing algorithm (for example Argon2id), never store or log plaintext passwords, and never return the password or hash. Production authentication/session design is not implemented by this profile type.

The proposed authenticated profile operations are:

- `GET /api/auth/profile` returns the current user's safe profile.
- `PATCH /api/auth/profile` updates editable profile fields; friend connections remain separate.
- `POST /api/auth/register` accepts registration fields plus a password and returns only the safe profile (or an authentication/session response that contains that profile).

Example registration request (the response must not echo `password`):

```json
{
  "firstName": "Jordan",
  "lastName": "Taylor",
  "email": "jordan@example.com",
  "phoneNumber": "+14155552671",
  "password": "<sent securely; never returned>"
}
```

### Person

### Person

A person is a person the user may associate with gift ideas and events.

```json
{
  "id": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
  "firstName": "Sarah",
  "lastName": "Lee",
  "notes": "Likes hiking and science fiction.",
  "imageUrl": "https://example.com/images/sarah.jpg",
  "createdAt": "2026-10-22T14:30:00Z",
  "updatedAt": "2026-10-22T14:30:00Z"
}
```

`notes` and `imageUrl` are optional. The notes field is plain text; clients can render it as a multiline text area.

### Event

An event has a target date and optional overall budget. Participants associate people with the event; `personalBudget` is the participant's budget for that event, not a field on the person.

```json
{
  "id": "3f77a2fa-f293-4d6b-9855-087f969a2b15",
  "name": "Christmas 2026",
  "targetDate": "2026-12-25",
  "budget": {
    "amountMinor": 50000,
    "currency": "USD"
  },
  "participants": [
    {
      "personId": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
      "personalBudget": {
        "amountMinor": 10000,
        "currency": "USD"
      }
    }
  ],
  "createdAt": "2026-10-22T14:30:00Z",
  "updatedAt": "2026-10-22T14:30:00Z"
}
```

`budget` and `personalBudget` can be omitted if not set. A create request may omit `participants`, but event responses should always include `participants: []` when there are no participants. Decide whether event budgets are required before finalizing validation rules.

### Gift idea

A gift idea belongs to a person and may optionally be associated with an event. The event association makes it possible to show a person's ideas both generally and for a specific occasion.

```json
{
  "id": "8ccaa0bc-8bbf-490d-a810-aaae26f87ff6",
  "personId": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
  "eventId": "3f77a2fa-f293-4d6b-9855-087f969a2b15",
  "label": "Noise-cancelling headphones",
  "type": "AMAZON",
  "description": "Over-ear, in black.",
  "url": "https://www.amazon.com/dp/example",
  "imageUrl": "https://example.com/images/headphones.jpg",
  "price": {
    "amountMinor": 12999,
    "currency": "USD"
  },
  "status": "ACTIVE",
  "createdAt": "2026-10-22T14:30:00Z",
  "updatedAt": "2026-10-22T14:30:00Z"
}
```

Supported `type` values in this draft: `WEBSITE`, `AMAZON`, and `FREE_TEXT`. Supported `status` values: `ACTIVE`, `BOUGHT`, and `ARCHIVED`; a newly created idea defaults to `ACTIVE`. `url`, `description`, `imageUrl`, `price`, and `eventId` are optional. For `FREE_TEXT`, `description` can hold the notes; for web-based ideas, `url` identifies the product. Confirm whether an Amazon item should be represented by this same resource plus `type: "AMAZON"`, or whether it needs Amazon-specific metadata later.

## Dashboard and detail response examples

The dashboard needs people and events. The frontend can call each collection endpoint separately, or the backend can later provide a dedicated aggregate endpoint if that improves the UI's loading behavior.

Example `GET /api/people` response:

```json
[
  {
    "id": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
    "firstName": "Sarah",
    "lastName": "Lee",
    "imageUrl": "https://example.com/images/sarah.jpg",
    "createdAt": "2026-10-22T14:30:00Z",
    "updatedAt": "2026-10-22T14:30:00Z"
  }
]
```

Example `GET /api/events` response:

```json
[
  {
    "id": "3f77a2fa-f293-4d6b-9855-087f969a2b15",
    "name": "Christmas 2026",
    "targetDate": "2026-12-25",
    "participants": [
      {
        "personId": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
        "personalBudget": {
          "amountMinor": 10000,
          "currency": "USD"
        }
      }
    ],
    "createdAt": "2026-10-22T14:30:00Z",
    "updatedAt": "2026-10-22T14:30:00Z"
  }
]
```

The person detail screen needs the person's events and gift ideas. The initial proposal uses dedicated relationship endpoints so response sizes stay predictable:

- `GET /api/people/{personId}/events` returns the events associated with that person.
- `GET /api/people/{personId}/gift-ideas` returns that person's ideas.
- `GET /api/gift-ideas/{giftIdeaId}` returns the full idea selected for the details popup.

A later API could combine related data into a person-detail response if that is more convenient; agree on one approach before implementing both sides.

## Example requests

Set the local base URL for the following examples:

```sh
API_BASE_URL=http://localhost:8080
```

### Dashboard collections

```sh
curl -i "$API_BASE_URL/api/people"
curl -i "$API_BASE_URL/api/events"
```

### Person detail and gift idea popup

```sh
PERSON_ID=2e58b6d0-487a-4b2a-a6a1-543aa14c0c42
GIFT_ID=8ccaa0bc-8bbf-490d-a810-aaae26f87ff6

curl -i "$API_BASE_URL/api/people/$PERSON_ID"
curl -i "$API_BASE_URL/api/people/$PERSON_ID/events"
curl -i "$API_BASE_URL/api/people/$PERSON_ID/gift-ideas"
curl -i "$API_BASE_URL/api/gift-ideas/$GIFT_ID"
```

### Create a person

The client supplies editable fields; the server generates the UUID and timestamps.

```sh
curl -i -X POST "$API_BASE_URL/api/people" \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Sarah",
    "lastName": "Lee",
    "notes": "Likes hiking and science fiction."
  }'
```

### Create an event with a participant

```sh
curl -i -X POST "$API_BASE_URL/api/events" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Christmas 2026",
    "targetDate": "2026-12-25",
    "budget": { "amountMinor": 50000, "currency": "USD" },
    "participants": [
      {
        "personId": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
        "personalBudget": { "amountMinor": 10000, "currency": "USD" }
      }
    ]
  }'
```

### Create a gift idea

```sh
curl -i -X POST "$API_BASE_URL/api/gift-ideas" \
  -H 'Content-Type: application/json' \
  -d '{
    "personId": "2e58b6d0-487a-4b2a-a6a1-543aa14c0c42",
    "eventId": "3f77a2fa-f293-4d6b-9855-087f969a2b15",
    "label": "Noise-cancelling headphones",
    "type": "AMAZON",
    "url": "https://www.amazon.com/dp/example",
    "price": { "amountMinor": 12999, "currency": "USD" }
  }'
```

### Update a gift idea's status

This draft uses `PATCH` for a partial update. Decide whether the backend instead prefers `PUT` or a dedicated purchase operation.

```sh
curl -i -X PATCH "$API_BASE_URL/api/gift-ideas/8ccaa0bc-8bbf-490d-a810-aaae26f87ff6" \
  -H 'Content-Type: application/json' \
  -d '{ "status": "BOUGHT" }'
```

## Suggested response and error behavior

- `GET` returns `200 OK`; collection endpoints return JSON arrays, including `[]` when empty.
- Successful create returns `201 Created` and the created resource, including its server-generated ID and timestamps.
- Successful update returns `200 OK` with the updated resource, or `204 No Content` if the API consistently chooses bodyless updates.
- Invalid input returns `400 Bad Request` with a useful validation message; missing resources return `404 Not Found`.
- Consider using one consistent error shape, for example:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed.",
  "fieldErrors": {
    "targetDate": "Must be an ISO date in YYYY-MM-DD format."
  }
}
```

## Decisions to settle while implementing

1. Are event budgets and participant-specific budgets optional? Can they use different currencies?
2. Can one gift idea be linked to multiple events, or exactly one optional event?
3. Is `BOUGHT` sufficient, or should purchases track purchase date/actual price separately?
4. Should `WEBSITE` and `AMAZON` only differ by enum, or should Amazon metadata have its own object/endpoint?
5. Should notes have a maximum length? Should people allow a missing first or last name?
6. Are collection endpoints paginated, and will the app have multiple users/authentication?
7. Should dashboard data use separate collection requests or one aggregate request?
8. What authentication/session mechanism and registration verification flow will be used?
9. What friend connection lifecycle/endpoints are required (invitation, acceptance, removal), and how should privacy of a user's created `Person` records work?
