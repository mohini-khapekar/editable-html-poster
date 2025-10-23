# Editable HTML Poster

A professional web-based visual editor for creating and editing HTML posters within a fixed 720×720 canvas. Built with Next.js, TypeScript, and Tailwind CSS following SOLID design principles.

## Features

### Core Functionality
- **HTML Import**: Upload .html files or paste raw HTML content
- **Visual Canvas**: Fixed 720×720px editing workspace with overflow protection
- **Element Selection**: Click to select elements with visual feedback
- **Image Editing**: Replace images, edit src/alt attributes, adjust dimensions
- **Text Editing**: Double-click for inline editing, modify font properties
- **Element Movement**: Drag elements to reposition with absolute positioning
- **Element Management**: Add new text blocks and images, delete selected elements
- **HTML Export**: Download edited HTML with proper structure and metadata


- **Backspace Protection**: Input fields handle backspace correctly without deleting elements
- **Proper Delete Key**: Only Delete key removes selected elements, not Backspace
- **Image URL Support**: Fixed image loading from external URLs
- **Responsive Layout**: Mobile-friendly design with collapsible panels

## Technology Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Dependencies**:
  - `dompurify`: HTML sanitization for security
  - `react-draggable`: Element drag-and-drop functionality
  - `sonner`: Toast notifications
  - `lucide-react`: Icon library

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run typecheck
```

## Architecture & SOLID Design

### Project Structure

```
project/
├── app/
│   ├── page.tsx              # Main editor page with state management
│   ├── layout.tsx            # Root layout with toast notifications
│   └── globals.css           # Global styles and stage-specific CSS
├── components/
│   └── editor/
│       ├── Toolbar.tsx       # Top toolbar with all actions
│       ├── Stage.tsx         # 720×720 editable canvas
│       ├── PropertiesPanel.tsx # Right panel for element editing
│       
├── lib/
│   ├── utils.ts 
│   
├── types/
│   └── globals.css 
    └── layout.tsx
    └── page.tsx
└── components/ui/            # shadcn/ui components
```

### SOLID Principles Applied

#### Single Responsibility Principle (S)
Each component and module has one clear purpose:
- `Toolbar`: Manages toolbar actions and button states
- `Stage`: Handles canvas rendering and element interaction
- `PropertiesPanel`: Displays and updates element properties
- `ElementTree`: Shows hierarchical element structure
- `HistoryManager`: Manages undo/redo operations
- `html-parser.ts`: Handles HTML sanitization and parsing
- `element-utils.ts`: Provides element manipulation utilities

#### Open/Closed Principle (O)
The architecture is open for extension but closed for modification:
- New element types can be added by extending element creation functions
- New tools can be added to the toolbar without changing existing code
- Properties panel adapts to different element types via conditional rendering

#### Liskov Substitution Principle (L)
All editable elements (text, images, divs) follow the same `EditorElement` interface:
- Selection works identically for all element types
- Movement and deletion are consistent across all elements
- Element data extraction follows the same pattern

#### Interface Segregation Principle (I)
Components receive only the props they need:
- `PropertiesPanel` receives element data and update callbacks, not entire state
- `Stage` receives only rendering and interaction props
- `Toolbar` receives action callbacks without knowing implementation details

#### Dependency Inversion Principle (D)
High-level modules depend on abstractions:
- Editor page depends on `HistoryManager` interface, not implementation
- Components depend on callback functions, not direct DOM manipulation
- Utility functions work with generic element data, not specific implementations

### State Management

The main editor state is managed in `app/page.tsx` using React hooks:
- `html`: Current HTML content as string
- `selectedId`: Currently selected element ID
- `multiSelectedIds`: Array of multi-selected element IDs
- `selectedElement`: Detailed data of selected element

### Security Considerations

1. **HTML Sanitization**: All imported HTML is sanitized using DOMPurify
2. **Allowed Tags**: Only safe HTML tags are permitted
3. **Data URIs**: Image data URIs are explicitly allowed for uploads
4. **No Script Execution**: All potentially dangerous attributes are removed



## Usage Guide

### Importing HTML

1. Click the "Import" button in the toolbar
2. Choose to either:
   - Upload an .html file, or
   - Paste raw HTML content
3. The poster content will be extracted and rendered in the 720×720 canvas

### Editing Elements

**Text Elements:**
- Single click to select
- Double click to edit inline
- Use properties panel to adjust font size, weight, color
- Edit position values for precise placement

**Image Elements:**
- Single click to select
- Use properties panel to change image source (URL or upload)
- Adjust alt text for accessibility
- Modify width and height

### Managing Elements

**Adding:**
- Click "Text" to add a new text block
- Click "Image" to add a new image placeholder

**Moving:**
- Click and drag any element to reposition
- Position updates are reflected in properties panel


**Deleting:**
- Select element and press Delete key or click Delete button
- Confirm action if needed

### Exporting

Click "Export" button to download your edited HTML file. The exported file:
- Includes all modifications
- Preserves original styles
- Contains metadata tag for tracking
- Can be opened directly in any browser

## Known Limitations

1. **Fixed Canvas Size**: Canvas is always 720×720px (mobile scales proportionally)
2. **Element Tree on Mobile**: Hidden on small screens to save space
3. **Drag Performance**: Very complex posters may experience slight lag
4. **Browser Compatibility**: Best experience on modern browsers (Chrome, Firefox, Edge, Safari)

## Future Improvements

1. **Enhanced Alignment**:
   - Snap-to-grid functionality
   - Alignment guides when dragging
   - Distribute elements evenly

2. **Advanced Selection**:
   - Lasso selection tool
   - Select by element type filter
   - Invert selection

3. **Layer Management**:
   - Z-index controls
   - Bring to front/send to back
   - Layer locking

4. **Templates**:
   - Pre-built poster templates
   - Save custom templates
   - Template gallery

5. **Collaboration**:
   - Real-time multi-user editing
   - Comments and annotations
   - Version history

6. **Export Options**:
   - Export as PNG/JPG image
   - Export as PDF
   - Export to various poster sizes

7. **AI Assistance**:
   - AI-powered color suggestions
   - Smart text suggestions
   - Auto-layout recommendations

## Testing the Sample HTML

The project includes support for the sample poster HTML. To test:

1. Click "Import" button
2. Switch to "Paste HTML" tab
3. Paste the sample HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sample Poster</title>
<style>
body { margin: 0; padding: 0; }
.poster {
width: 720px; height: 720px; position: relative;
background: #f3f4f6; overflow: hidden; font-family: sans-serif;
}
.title {
position: absolute; top: 80px; left: 40px;
font-size: 48px; font-weight: bold; color: #111827;
}
.subtitle {
position: absolute; top: 160px; left: 40px;
font-size: 20px; color: #374151;
}
.hero {
position: absolute; bottom: 0; right: 0; width: 380px; height: 380px;
object-fit: cover; 
}
</style>
</head>
<body>
<div class="poster">
<h1 class="title">Summer Sale</h1>
<p class="subtitle">Up to <strong>50% off</strong> on select items!</p>
<img class="hero" src="https://images.unsplash.com/photo-1761165308046-174a56e73525?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="Model" />
</div>
</body>
</html>
```

4. Click "Import" and the poster will render correctly with all styling

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Follow the existing code structure and SOLID principles
2. Add TypeScript types for all new features
3. Test on multiple devices and browsers
4. Update documentation for new features



