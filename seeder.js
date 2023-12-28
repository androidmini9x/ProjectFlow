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
        "name": "Design Wireframes",
        "description": "Create wireframes for the new project interface",
        "start": "2023-12-22",
        "end": "2023-12-28"
    },
    {
        "name": "Develop Backend API",
        "description": "Implement the backend API functionalities",
        "start": "2023-12-23",
        "end": "2023-12-30"
    },
    {
        "name": "User Interface Testing",
        "description": "Conduct user interface testing for responsiveness",
        "start": "2023-12-25",
        "end": "2023-12-31"
    },
    {
        "name": "Deploy to Production",
        "description": "Deploy the application to the production environment",
        "start": "2023-12-28",
        "end": "2024-01-05"
    },
    {
        "name": "Client Meeting",
        "description": "Discuss project progress with the client",
        "start": "2023-12-30",
        "end": "2024-01-03"
    },
    {
        "name": "Content Creation",
        "description": "Generate content for the project documentation",
        "start": "2024-01-02",
        "end": "2024-01-08"
    },
    {
        "name": "Bug Fixing",
        "description": "Address and fix reported bugs in the system",
        "start": "2024-01-05",
        "end": "2024-01-12"
    },
    {
        "name": "Team Collaboration",
        "description": "Coordinate with team members for project collaboration",
        "start": "2024-01-08",
        "end": "2024-01-15"
    },
    {
        "name": "Final Testing",
        "description": "Perform final testing and quality assurance",
        "start": "2024-01-10",
        "end": "2024-01-17"
    },
    {
        "name": "Project Delivery",
        "description": "Deliver the completed project to the client",
        "start": "2024-01-15",
        "end": "2024-01-22"
    }
]

// Create accounts

const createUsers = async () => {
    const createdUsers = await dbClient.db.collection('users').insertMany(users);
    return Object.keys(createdUsers.insertedIds).map(e => createdUsers.insertedIds[e]);
}

const start = async () => {
    await dbClient.db.collection('users').drop();
    await dbClient.db.collection('projects').drop();
    await dbClient.db.collection('tasks').drop();
    // await (new Promise((resolve) => setTimeout(resolve, 10000)));
    const createdUsers = await createUsers();
    const anotherUsers = createdUsers.slice(3);

    const admin1 = createdUsers[0];
    let project1 = project.slice(0, 5).map(e => ({ ...e, owner: admin1, teams: [admin1, ...anotherUsers.slice(0, 4)] }));

    const admin2 = createdUsers[1];
    let project2 = project.slice(5, 8).map(e => ({ ...e, owner: admin2, teams: [admin2] }));

    const admin3 = createdUsers[2];
    let project3 = project.slice(8).map(e => ({ ...e, owner: admin3, teams: [admin3] }));

    const createdProj1 = await dbClient.db.collection('projects').insertMany(project1);
    const createdProj2 = await dbClient.db.collection('projects').insertMany(project2);
    const createdProj3 = await dbClient.db.collection('projects').insertMany(project3);

    const projInserted1 = Object.keys(createdProj1.insertedIds).map(e => createdProj1.insertedIds[e]);
    const projInserted2 = Object.keys(createdProj2.insertedIds).map(e => createdProj2.insertedIds[e]);
    const projInserted3 = Object.keys(createdProj3.insertedIds).map(e => createdProj3.insertedIds[e]);

    const task1 = tasks.slice(0, 3).map(e => ({
        ...e,
        owner: admin1,
        project_id: projInserted1[0]
    }));
    await dbClient.db.collection('tasks').insertMany(task1);
    const task1_1 = tasks.slice(3, 7).map(e => ({
        ...e,
        owner: admin1,
        project_id: projInserted1[1]
    }));
    await dbClient.db.collection('tasks').insertMany(task1_1);
    const task2 = tasks.slice(3, 7).map(e => ({
        ...e,
        owner: admin2,
        project_id: projInserted2[0]
    }));
    await dbClient.db.collection('tasks').insertMany(task2);
    const task3 = tasks.slice(7).map(e => ({
        ...e,
        owner: admin3,
        project_id: projInserted3[0]
    }));
    await dbClient.db.collection('tasks').insertMany(task3);
}

start();