# QuickGigs

A modern freelancing platform built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quickgigs.git
cd quickgigs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in the required environment variables in `.env.local`

4. Run the development server:
```bash
npm run dev
```

## Deployment

### Production Build

1. Create a production build:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

### Environment Variables

Make sure to set up all required environment variables in your production environment:

- `NEXT_PUBLIC_APP_URL`: Your production URL
- Firebase configuration
- Google AI API key
- Razorpay credentials
- Appwrite configuration

### Deployment Platforms

#### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

#### Other Platforms
- Ensure Node.js 18+ is available
- Set up environment variables
- Run `npm run build` and `npm run start`

## Features

- User authentication
- Gig posting and management
- Real-time messaging
- Payment integration
- Profile management
- Notifications system

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Firebase
- Appwrite
- Razorpay
- Google AI

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.