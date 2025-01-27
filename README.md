# WhisperLink

WhisperLink is an anonymous messaging platform that allows users to send and receive messages securely and privately. It provides a seamless way to communicate without revealing personal information, focusing on user privacy and simplicity.

## Features

- **Anonymous Messaging**: Send and receive messages without revealing your identity.
- **NextAuth Authentication**: Secure user authentication using NextAuth.
- **Message Privacy**: Messages can only be accessed by intended recipients.
- **User Preferences**: Users can enable or disable the ability to receive messages.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) for building a modern and performant web application.
- **Database**: [Prisma](https://www.prisma.io/) as the ORM for managing the application's database.
- **Authentication**: [NextAuth](https://next-auth.js.org/) for secure authentication and authorization.
- **UI**: [shadCN] for a better ui design 


## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A database (e.g., PostgreSQL, MySQL, SQLite) compatible with Prisma

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/whisperlink.git
   cd whisperlink
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables by creating a `.env` file at the root of the project:
   ```env
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=your_nextauth_url
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be running at [http://localhost:3000](http://localhost:3000).

## Usage

1. Create an account or log in to an existing one.
2. Share your unique username or generated link with others to receive anonymous messages.
3. View messages in your inbox securely.
4. Toggle message reception preferences through the user settings.
