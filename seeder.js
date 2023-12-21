import dbClient from "./utils/db";

const project = [
    {
        "name": "Phoenix Initiative",
        "description": "A groundbreaking initiative to develop sustainable energy solutions.",
    },
    {
        "name": "Project Nebula",
        "description": "Exploring the mysteries of the cosmos through advanced space exploration.",
    },
    {
        "name": "BioTech Revolution",
        "description": "Revolutionizing healthcare with cutting-edge biotechnological advancements.",
    },
    {
        "name": "Urban Renewal Project",
        "description": "Transforming urban landscapes with sustainable infrastructure and smart city solutions.",
    },
    {
        "name": "Project Genesis",
        "description": "Fostering innovation and entrepreneurship to nurture new startups and ideas.",
    },
    {
        "name": "GreenTech Initiative",
        "description": "Promoting environmental sustainability through technology and eco-friendly solutions.",
    },
    {
        "name": "Project Renaissance",
        "description": "Reviving ancient arts and culture through digital preservation and restoration.",
    },
    {
        "name": "Future Mobility Project",
        "description": "Shaping the future of transportation with innovative and sustainable mobility solutions.",
    },
    {
        "name": "Project Quantum",
        "description": "Exploring the frontiers of quantum computing for unprecedented computational power.",
    },
    {
        "name": "Project Harmony",
        "description": "Fostering global collaboration and understanding through digital communication platforms.",
    }
];

const users = [
    {
        "firstname": "Ahmed",
        "lastname": "Jekko",
        "email": "ahmed@google.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Jane",
        "lastname": "Smith",
        "email": "jane.smith@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Michael",
        "lastname": "Johnson",
        "email": "michael.johnson@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Emily",
        "lastname": "Brown",
        "email": "emily.brown@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Daniel",
        "lastname": "Miller",
        "email": "daniel.miller@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Sophia",
        "lastname": "Davis",
        "email": "sophia.davis@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Alexander",
        "lastname": "Wilson",
        "email": "alexander.wilson@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Olivia",
        "lastname": "Moore",
        "email": "olivia.moore@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "William",
        "lastname": "Taylor",
        "email": "william.taylor@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    },
    {
        "firstname": "Ava",
        "lastname": "Anderson",
        "email": "ava.anderson@example.com",
        "password": "$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa"
    }
];

const tasks = [
    {
        "title": "Design Wireframes",
        "description": "Create wireframes for the new project interface",
        "start": "2023-12-22",
        "end": "2023-12-28"
    },
    {
        "title": "Develop Backend API",
        "description": "Implement the backend API functionalities",
        "start": "2023-12-23",
        "end": "2023-12-30"
    },
    {
        "title": "User Interface Testing",
        "description": "Conduct user interface testing for responsiveness",
        "start": "2023-12-25",
        "end": "2023-12-31"
    },
    {
        "title": "Deploy to Production",
        "description": "Deploy the application to the production environment",
        "start": "2023-12-28",
        "end": "2024-01-05"
    },
    {
        "title": "Client Meeting",
        "description": "Discuss project progress with the client",
        "start": "2023-12-30",
        "end": "2024-01-03"
    },
    {
        "title": "Content Creation",
        "description": "Generate content for the project documentation",
        "start": "2024-01-02",
        "end": "2024-01-08"
    },
    {
        "title": "Bug Fixing",
        "description": "Address and fix reported bugs in the system",
        "start": "2024-01-05",
        "end": "2024-01-12"
    },
    {
        "title": "Team Collaboration",
        "description": "Coordinate with team members for project collaboration",
        "start": "2024-01-08",
        "end": "2024-01-15"
    },
    {
        "title": "Final Testing",
        "description": "Perform final testing and quality assurance",
        "start": "2024-01-10",
        "end": "2024-01-17"
    },
    {
        "title": "Project Delivery",
        "description": "Deliver the completed project to the client",
        "start": "2024-01-15",
        "end": "2024-01-22"
    }
]

// Create accounts

const start = async () => {
    await dbClient.db.collection('users').drop();
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        console.log(element)
    }
}