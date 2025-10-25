<!-- 95427fae-4fef-4bf5-928c-29b061d30cd3 8ac70028-c8ca-401a-a928-007de78c9d55 -->
# Add Draggable Project Cards to Chat Interface

## Overview

Create 4 draggable project cards positioned around the chat with glass effect. When dropped into chat, they become thumbnails with unique messages that trigger case study responses.

## Implementation Details

### 1. Card Component Structure

Create project cards with:

- **Dimensions**: 263px width, 266px height
- **Glass effect**: `background: rgba(255, 255, 255, 0.08)`, `backdrop-filter: blur(20px)`
- **Border**: `1px solid #FFFFFF`, `border-radius: 44px`
- **Images**: Cloudinary URLs for each project
- **Shadow**: Subtle drop shadow for depth

### 2. Card Positions & Rotations

Position cards around chat interface:

- **OVA** (top-left): `rotate(-15deg)`, behind chat
- **IOC** (bottom-left): `rotate(+15deg)`, behind chat
- **GREEX** (top-right): `rotate(+15deg)`, behind chat
- **DealDoc** (bottom-right): `rotate(-15deg)`, behind chat

Use absolute positioning with z-index to layer behind chat.

### 3. Drag & Drop Implementation

Using Framer Motion's drag functionality:

- Enable `drag` on each card
- Track drag position with `onDragEnd`
- Detect if dropped over chat area (check coordinates)
- Show overlay/highlight on chat when card is dragged over it
- Reset card position if dropped outside chat

### 4. Drop Interaction

When card is dropped into chat:

1. Hide the dragged card (or animate it flying into chat)
2. Create thumbnail version in chat messages
3. Send unique message for that project:

   - OVA: "what did designing ova teach you"
   - GREEX: "whats was ur process for greex"
   - IOC: "what was the most challenging part about ioc"
   - DealDoc: "what did the clients request for exactly?"

4. Trigger case study response from bot

### 5. Card Data Structure

```typescript
const PROJECT_CARDS = [
  {
    id: 'ova',
    title: 'ova : period tracking app',
    image: 'https://res.cloudinary.com/dky01erho/image/upload/v1761388415/Slide_4_3_-_1_2_zr9r7i.png',
    message: 'what did designing ova teach you',
    position: { top: '20%', left: '5%' },
    rotation: -15
  },
  // ... other cards
]
```

### 6. Styling Details

- Use `transform-style: preserve-3d` for 3D effect
- Add subtle hover effect (scale up slightly)
- Animate card when dragging (increase shadow, slight scale)
- Smooth transitions for all interactions

## Files to Modify

- `src/components/generated/PortfolioHeroSection.tsx` - Add cards around chat interface
- May need to adjust chat z-index and positioning

## Technical Approach

- Use Framer Motion's `motion.div` with drag props
- Calculate drop zone using `getBoundingClientRect()`
- Integrate with existing `handleSendMessage` to trigger bot response
- Store card state (visible/hidden) in component state

### To-dos

- [ ] Create draggable card component with glass morphism effect and proper styling
- [ ] Position 4 cards around chat interface with correct rotations and z-index
- [ ] Implement drag & drop functionality with Framer Motion and drop zone detection
- [ ] Handle drop interaction: hide card, show thumbnail in chat, send message, trigger response
- [ ] Add hover overlay on chat when dragging, smooth animations