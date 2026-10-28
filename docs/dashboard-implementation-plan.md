# Dashboard implementation plan

The dashboard starts with unfiltered mock data. Profile ownership and login are intentionally deferred; once authentication exists, the API can scope these collections to the signed-in user.

## Milestone 1: Resource-shaped dashboard collections — complete

- Replace the temporary `Group` dashboard projection with separate people and events collections.
- Fetch both collections through the shared data-source interface and render distinct sections.
- Keep mock and REST implementations aligned with the API's `Person` and `Event` resource shapes.
- Standardize event responses to include `participants: []` when there are no participants.
- Preserve loading, error, retry, and empty states.

## Milestone 2: Selectable dashboard items — complete

- Render people and events as accessible selectable items with visible selection feedback.
- Track the selected resource with a discriminated person/event selection, not just an ID.
- Keep selection behavior separate from loading and collection rendering.

## Milestone 3: Person details modal — complete

- Add a reusable, cross-platform detail modal with a clear close action.
- Show a selected person's image when available, name, notes, and related gift ideas.
- Handle optional fields and loading/error states if details are fetched on demand.
- Extend the shared data-source interface and both implementations with the person gift-ideas relationship request.

## Milestone 4: Event details modal — complete

- Reuse the modal pattern for events.
- Show the event name/date, optional overall budget, participants and optional personal budgets, and related gift ideas.
- Resolve related people by ID without embedding stale copies in the event resource.
- Filter the existing gift-idea collection by event ID, avoiding an undocumented endpoint for this draft.

## Create-person CRUD prototype — complete

- Add a dashboard button that opens a person form using the draft's `CreatePersonDto` fields.
- Let the user select active existing gift ideas for a proposed association with the new person.
- Preview the person request data and selected gift IDs locally; do not persist or reassign mocked records.
- Keep gift-association data separate from the Person JSON shape because gift ideas currently reference a required `personId`.

## Later: Profile ownership and authentication

- Do not add owner/profile fields or local filtering before account requirements are defined.
- When authentication is introduced, have the backend return resources belonging to the signed-in user and apply that scope consistently to events, people, and gift ideas.
