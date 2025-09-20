# Athletica Pro - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from fitness and productivity apps like Nike Training Club, MyFitnessPal, and Strava, combined with modern dashboard patterns from Linear and Notion for the trainer interface.

## Core Design Elements

### Color Palette
**Primary Brand Colors:**
- Primary: 220 85% 45% (Deep energetic blue)
- Secondary: 220 20% 15% (Dark charcoal)
- Success: 142 76% 36% (Fitness green)
- Warning: 38 92% 50% (Energy orange)

**Background & Surface:**
- Light mode: 0 0% 98% (Off-white)
- Dark mode: 220 13% 8% (Deep dark blue-gray)
- Cards: Light mode 0 0% 100%, Dark mode 220 13% 12%

### Typography
- **Primary Font**: Inter (clean, athletic feel)
- **Display Font**: Inter (consistent brand voice)
- **Sizes**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
- **Weights**: font-medium for labels, font-semibold for headings, font-bold for hero text

### Layout System
**Spacing Units**: Consistent use of Tailwind units 2, 4, 6, and 8
- `p-4` for card padding
- `gap-6` for component spacing
- `m-8` for section margins
- `h-2` for progress bars and dividers

### Component Library

#### Core Navigation
- **Bottom Tab Bar** (mobile-first): Home, Workouts, Progress, Chat, Profile
- **Sidebar** (desktop): Collapsible with trainer tools and student management
- **Header**: Logo, notifications, user avatar with role indicator

#### Workout Components
- **Exercise Cards**: Large touch targets with exercise thumbnails, sets/reps display
- **Timer Components**: Circular progress indicators with large, readable numbers
- **Rest Timer**: Full-screen overlay with breathing animation
- **Progress Tracking**: Clean charts using subtle gradients (220 85% 45% to 220 85% 60%)

#### Forms & Inputs
- **Rounded Design**: border-radius consistently using `rounded-lg`
- **Large Touch Targets**: Minimum 44px height for mobile interaction
- **Clear States**: Distinct visual feedback for active, completed, and pending states

#### Data Displays
- **Dashboard Cards**: Minimal shadows, clear hierarchy with metric emphasis
- **Progress Charts**: Subtle gradients from primary color, clean axes
- **Exercise Library**: Grid layout with video thumbnails and clear categorization

### Visual Treatments

#### Gradients
- **Hero Sections**: Subtle gradient from 220 85% 45% to 220 85% 35%
- **Progress Indicators**: Light gradient overlays for completed states
- **Background Accents**: Very subtle gradients (220 10% 96% to 220 15% 98%) in light mode

#### Interactive States
- **Primary Actions**: Bold primary color with subtle elevation
- **Secondary Actions**: Outlined style with primary border
- **Destructive Actions**: Clean red (0 65% 50%) with appropriate contrast

### Mobile-First Considerations
- **Touch-Friendly**: All interactive elements minimum 44px
- **One-Handed Use**: Bottom navigation, thumb-reachable primary actions
- **Voice Commands**: Large, accessible microphone button during workouts
- **Offline Indicators**: Clear visual feedback for offline/online states

### PWA Specific Elements
- **Install Prompt**: Subtle, non-intrusive banner with clear value proposition
- **Loading States**: Skeleton screens for smooth perceived performance
- **Offline Messaging**: Friendly, informative offline indicators

### Images
- **Exercise Demonstrations**: High-quality video thumbnails with play overlay
- **Progress Photos**: Before/after comparison layouts with privacy controls
- **Trainer Profiles**: Professional headshots in circular frames
- **No Large Hero Image**: Focus on functional, data-driven interface rather than marketing imagery

This design system prioritizes functionality and user experience while maintaining a modern, energetic aesthetic appropriate for fitness applications.