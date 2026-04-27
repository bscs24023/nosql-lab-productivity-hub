// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  await db.collection('users').createIndex({ email: 1 }, { unique: true });


  // =============================================================================
  //  TODO: Insert your seed data below.
  //
  //  Hints:
  //    - Hash passwords:   const hash = await bcrypt.hash('password123', 10);
  //    - Capture inserted ids:
  //        const u = await db.collection('users').insertOne({ ... });
  //        const userId = u.insertedId;
  //    - Use those ids when inserting projects/tasks/notes.
  //    - Demonstrate schema flexibility: include at least one optional field
  //      on SOME documents but not all (e.g. dueDate on some tasks only).
  //
  //  Sample task shape:
  //    {
  //      ownerId: <ObjectId>,
  //      projectId: <ObjectId>,
  //      title: "Write report introduction",
  //      status: "todo",
  //      priority: 3,
  //      tags: ["writing", "urgent"],
  //      subtasks: [
  //        { title: "Outline sections", done: true },
  //        { title: "Draft", done: false }
  //      ],
  //      createdAt: new Date()
  //    }
  // =============================================================================

  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('password456', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'areej@test.com',
    passwordHash: hash1,
    name: 'Areej Farhan',
    createdAt: new Date()
  });

  const u2 = await db.collection('users').insertOne({
    email: 'ali@test.com',
    passwordHash: hash2,
    name: 'Ali Hassan',
    createdAt: new Date()
  });

  const userId1 = u1.insertedId;
  const userId2 = u2.insertedId;



  const p1 = await db.collection('projects').insertOne({
    ownerId: userId1,
    name: 'Project1',
    description: 'des1',
    archived: false,
    createdAt: new Date('2025-01-10')
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: userId1,
    name: 'Project2',
    description: 'des2',
    archived: false,
    createdAt: new Date('2025-02-15')
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: userId2,
    name: 'Project3',
    description: 'des3',
    archived: false,
    createdAt: new Date('2025-03-01')
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: userId2,
    name: 'Project4',
    description: 'des4',
    archived: true,
    createdAt: new Date('2024-09-01')
  });

  const proj1 = p1.insertedId;
  const proj2 = p2.insertedId;
  const proj3 = p3.insertedId;
  const proj4 = p4.insertedId;

  await db.collection('tasks').insertMany([
    {
      ownerId: userId1,
      projectId: proj1,
      title: 'title1',
      status: 'done',
      priority: 1,
      tags: ['t1', 't2'],
      subtasks: [
        { title: 'subtitile1', done: true },
        { title: 'subtitile2', done: true }
      ],
      createdAt: new Date('2025-01-12')
    },
    {
      ownerId: userId1,
      projectId: proj1,
      title: 'title2',
      status: 'in-progress',
      priority: 2,
      tags: ['t3', 't4'],
      subtasks: [
        { title: 'subtitile3', done: true },
        { title: 'subtitile4', done: false },
        { title: 'subtitile5', done: false }
      ],
      createdAt: new Date('2025-01-20')
    },
    {
      ownerId: userId1,
      projectId: proj2,
      title: 'title3',
      status: 'todo',
      priority: 2,
      tags: ['t5', 't6'],
      subtasks: [
        { title: 'subtitile6', done: false },
        { title: 'subtitile7', done: false }
      ],
      createdAt: new Date('2025-02-16'),
      dueDate: new Date('2025-03-01') 
    },
    {
      ownerId: userId1,
      projectId: proj2,
      title: 'title4',
      status: 'todo',
      priority: 3,
      tags: ['t7'],
      subtasks: [
        { title: 'subtitile8', done: false }
      ],
      createdAt: new Date('2025-02-20')
    },
    {
      ownerId: userId2,
      projectId: proj3,
      title: 'title5',
      status: 'in-progress',
      priority: 1,
      tags: ['t8', 't9'],
      subtasks: [
        { title: 'subtitile9', done: true },
        { title: 'subtitile10', done: false }
      ],
      createdAt: new Date('2025-03-05'),
      dueDate: new Date('2025-03-20')  
    },
    {
      ownerId: userId2,
      projectId: proj3,
      title: 'title6',
      status: 'todo',
      priority: 2,
      tags: ['t10', 't11'],
      subtasks: [
        { title: 'subtitile11', done: false },
        { title: 'subtitile12', done: false }
      ],
      createdAt: new Date('2025-03-10')
    },
    {
      ownerId: userId1,
      projectId: proj1,
      title: 'title7',
      status: 'todo',
      priority: 3,
      tags: ['t12', 't13'],
      subtasks: [
        { title: 'subtitile13', done: false },
        { title: 'subtitile14', done: false }
      ],
      createdAt: new Date('2025-02-01')
    },
    {
      ownerId: userId2,
      projectId: proj3,
      title: 'title8',
      status: 'done',
      priority: 1,
      tags: ['t14', 't15'],
      subtasks: [
        { title: 'subtitile15', done: true },
        { title: 'subtitile16', done: true }
      ],
      createdAt: new Date('2025-03-02')
    },
    {
      ownerId: userId1,
      projectId: proj2,
      title: 'title9',
      status: 'in-progress',
      priority: 1,
      tags: ['t16', 't17'],
      subtasks: [
        { title: 'subtitile17', done: true },
        { title: 'subtitile18', done: false }
      ],
      createdAt: new Date('2025-02-18')
    },
    {
      ownerId: userId2,
      projectId: proj4,
      title: 'title10',
      status: 'done',
      priority: 3,
      tags: ['t18'],
      subtasks: [],
      createdAt: new Date('2024-09-15')
    }
  ]);

 await db.collection('notes').insertMany([
    {
      ownerId: userId1,
      projectId: proj1,
      title: 'T1',
      content: 'C1',
      tags: ['t1'],
      createdAt: new Date('2025-01-15')
    },
    {
      ownerId: userId1,
      projectId: proj2,
      title: 'T2',
      content: 'C2',
      tags: ['t2'],
      createdAt: new Date('2025-02-17')
    },
    {
      ownerId: userId1,
      title: 'T3',
      content: 'C3',
      tags: ['t3'],
      createdAt: new Date('2025-01-05')
    },
    {
      ownerId: userId2,
      projectId: proj3,
      title: 'T4',
      content: 'C4',
      tags: ['t4'],
      createdAt: new Date('2025-03-03')
    },
    {
      ownerId: userId2,
      title: 'T5',
      content: 'C5',
      tags: ['t5'],
      createdAt: new Date('2025-03-06')
    },
    {
      ownerId: userId1,
      projectId: proj1,
      title: 'T6',
      content: 'C6',
      tags: ['t6'],
      createdAt: new Date('2025-01-18')
    },
    {
      ownerId: userId2,
      projectId: proj3,
      title: 'T7',
      content: 'C7',
      tags: ['t7'],
      createdAt: new Date('2025-03-08')
    },
    {
      ownerId: userId1,
      title: 'T8',
      content: 'C8',
      tags: ['t8'],
      createdAt: new Date('2025-03-10')
    },
    {
      ownerId: userId2,
      projectId: proj3,
      title: 'T9',
      content: 'C9',
      tags: ['t9'],
      createdAt: new Date('2025-03-12')
    },
    {
      ownerId: userId1,
      projectId: proj2,
      title: 'T10',
      content: 'C10',
      tags: ['t10'],
      createdAt: new Date('2025-02-22')
    }
  ]); 

  console.log('TODO: implement seed.js');
  process.exit(0);
})();
