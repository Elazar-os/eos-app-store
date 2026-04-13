# EOS - Elazar's Operating System

A comprehensive app store built with Next.js, featuring multiple specialized applications including chatbot builder, restaurant menu management, photo selector, kosher launcher, shul community, and resume builder.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Elazar-os/eos-app-store.git
cd eos-app-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Copy your project URL and anon key from the project settings

   c. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   d. Run the database migrations:

      - Go to your Supabase dashboard
      - Navigate to the SQL Editor
      - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
      - Run the SQL script

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Apps Included

### 🤖 Chatbot Builder
- Submit business requirements for custom chatbots
- Support for API integration and training data
- Form-based submission system

### 🍽️ Restaurant Menu Builder
- Manage menu items with categories
- Screen dashboard with connection status
- Voice control simulation ("Hey Gary")
- Theme customization and screen management

### 📸 Photo Selector
- AI-powered photo analysis and selection
- Support for business, personal, and dating use cases
- Photo scoring and batch selection

### 🔒 Kosher Android Launcher
- Concept for secure Android launcher
- Approved app lockdown functionality
- Content filtering capabilities

### 🕍 Shul Community App
- Submit and manage Jewish community centers
- Zmanim (prayer times) and shiurim (lectures)
- CarPlay mode support

### 📄 Resume Site
- Professional resume builder
- Multiple view modes (professional/personal/both)
- Shareable resume links

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- `chatbot_submissions` - Chatbot creation requests
- `menu_items` - Restaurant menu items
- `menu_screens` - Display screen management
- `photos` - Photo storage and analysis
- `shuls` - Jewish community centers
- `zmanim` - Prayer times
- `shiurim` - Religious lectures
- `resumes` - User resume data

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
eos-app-store/
├── app/                    # Next.js app directory
│   ├── chatbot-builder/    # Chatbot builder app
│   ├── menu-builder/       # Restaurant menu builder
│   ├── photo-selector/     # Photo analysis tool
│   ├── kosher-launcher/    # Android launcher concept
│   ├── shul-community/     # Jewish community app
│   ├── resume-site/        # Resume builder
│   └── page.tsx           # Main app store page
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client configuration
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
└── public/                # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add your Supabase environment variables in Vercel dashboard
3. Deploy!

### Other Platforms

Make sure to set the environment variables for your Supabase configuration on your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or support, please contact the development team.
