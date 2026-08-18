# Verification Notes

## Retro checkout confirmation — 2026-08-18

- Desktop 1280×720: the centered dialog renders a clear `SIMULATED ONLY` status, a local-only disclaimer, an order preview with quantity and subtotal, and two visibly distinct actions.
- Mobile 375×812: the dialog docks within the viewport without horizontal overflow; its primary simulated-checkout action remains first and full width, while returning to the cart stays available below it.
- The successful browser flow also verified that the minus control is disabled at quantity one, incrementing changes the local quantity to two, and no order is created until simulated checkout is subsequently confirmed.
