# Bettercord Backend: Real-Time Chat Server for WPF Application
Bettercord Backend is a Node.js-based server designed to support a real-time chat application built with WPF in C#. It utilizes Express.js and Socket.IO to manage WebSocket connections, facilitating seamless, low-latency communication between clients. The server integrates with Astra DB, a cloud-based NoSQL database, to store user data, messages, and chat room information.

- Real-Time Communication: Uses Socket.IO to handle bi-directional event-based interactions, ensuring instant message delivery and updates across connected clients.

- Scalable Data Storage: Leverages Astra DB for efficient and scalable storage of chat histories, user profiles, and related metadata.

- User and Chat Room Management: Provides functionalities for user authentication, chat room creation, and management, ensuring organized and secure communication channels.

- WebSocket-Based Messaging: Supports real-time messaging without relying on traditional HTTP polling, improving performance and responsiveness.

### Setup Instructions:
Install Dependencies: Run npm install to install the required Node.js packages.

Configure Credentials: Fill in the necessary database credentials in the constants/credentials.js file to enable connection with Astra DB.

Start the Server: Execute npm run dev to launch the server in development mode.

