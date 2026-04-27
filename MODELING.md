# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores registered users with their credentials like name email etc.
- **projects** — A container related tasks. Each project belongs to one user and can be active or archived.
- **tasks** — Work inside a project. It has subtasks and tags. It references its project by ID
- **notes** — Stores freeform text notes that belong to a user

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  name: string (required),
  description: string (optional),
  archived: boolean (required),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  projectId: ObjectId (required, ref: projects),
  title: string (required),
  status: string (required),
  priority: number (required),
  tags: [string] (required),
  subtasks: [
  {
  title: string (required),
  done: boolean (required)
  }
  ] (required),
  dueDate: Date (optional),
  createdAt: Date (required)
  }

```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  projectId: ObjectId (optional, ref: projects),
  title: string (required),
  content: string (required),
  tags: [string] (required),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                       | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            |     Embed           | Subtasks are usually read and displayed together with their parent task. They arent independently queried.|
| Tags on a task                    |     Embed           |Tags are simple strings with no separate identity|
| Project → Task ownership          |     Reference       |Tasks can be queried independently so stroing them as reference is better than embedding them in their parent task|
| Note → optional Project link      |     Reference       |The link is optional and notes are read on their own|

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> **Field:** `dueDate` on the **tasks** collection.

Some tasks have a deadline, others do not. In MongoDB, tasks with no deadline 
leave out the `dueDate` field entirely as in no empty or null value needed. In SQL, every 
row would need a `due_date` column even if it's unused. This is schema flexibility which means that
documents in the same collection don't all need the same fields.
