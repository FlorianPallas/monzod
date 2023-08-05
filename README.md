# Monzod

> Strongly typed MongoDB using Zod

[![test](https://github.com/FlorianPallas/monzod/actions/workflows/test.yml/badge.svg)](https://github.com/FlorianPallas/monzod/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/FlorianPallas/monzod/branch/main/graph/badge.svg?token=RY55KVD15U)](https://codecov.io/gh/FlorianPallas/monzod)
[![license](https://img.shields.io/github/license/FlorianPallas/monzod)](https://img.shields.io/github/license/FlorianPallas/monzod)

## Installation

```sh
pnpm install monzod mongodb zod
yarn add monzod mongodb zod
npm install monzod mongodb zod
```

## Usage

### Basics

The idea behind using Zod together with MongoDB is to have a type safe interface to the database. This requires all data that is put into the database to be validated beforehand. This is where Zod comes in. Zod is a TypeScript-first schema declaration and validation library. It allows us to define a schema for our entities and validate them.

Monzod provides a few additions that make this process easier. A basic model definition could look like this:

```ts
// Schemas as Single Source of Truth
const bookSchema = z.object({
  _id: mz.id(), // <- Monzod adds a few helpers for common MongoDB types
  title: z.string(),
  description: z.string(),
  author: mz.id(),
  pageCount: z.number(),
});
type Book = z.infer<typeof bookSchema>; // <- Zod allows us to infer the type from the schema

const userSchema = z.object({
  _id: mz.id(),
  name: z.string(),
  email: z.string().email(),
  books: z.array(mz.id()),
});
type User = z.infer<typeof userSchema>;
```

### Mapping

MongoDB uses a few special types that are ideally kept within the database layer. We can define a few more objects that do not use theses types, so we can use them in our application code. Often that mapping simply comes down to converting the ids to strings. Monzod provides a few helpers to make this easier.

```ts
// Mapping schemas
const bookDTO = mz.mapSchema(bookSchema); // <- Monzod adds the same mapping helpers for entities
type BookDTO = z.infer<typeof bookDTO>;

const userDTO = mz.mapSchema(userSchema);
type UserDTO = z.infer<typeof userDTO>;

// Mapping entities
const book = await bookRepository.findOne({ ... });
//     ^? const book: { _id: ObjectId; ... }

const bookDTO = mz.mapEntity(book, bookDTO);
//     ^? const bookDTO: { id: string; ... }

bookDTOSchema.parse(bookDTO) // <- Mapped entities are compatible with their corresponding schemas
```

But sometimes you want more than just map the ids. For example you might want to map the `author` field to the actual author entity. We can use the methods from Monzod as base and extend them to our needs with Zod.

```ts
// Map custom schemas
const anonymousBookSchema = mz.mapSchema(bookSchema).omit({ author: true });

// Map custom entities
const mapAnonymousBook = (book: Book) => {
  const mappedBook = mz.mapEntity(book);
  delete mappedBook.author;
  return mappedBook;
}

const book = await bookRepository.findOne({ ... });
const anonymousBook = mapAnonymousBook(book);
//     ^? const anonymousBook: { id: string; title: string; description: string; pageCount: number; }
```
