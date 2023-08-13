# Monzod

> Single Source of Truth & Database Layer Validation for [MongoDB](https://www.mongodb.com/) :zap: powered by [Zod](https://zod.dev/) :heart:

[![npm version](https://img.shields.io/npm/v/monzod)](https://www.npmjs.com/package/monzod)
[![test](https://img.shields.io/github/actions/workflow/status/FlorianPallas/monzod/test.yml)](https://github.com/FlorianPallas/monzod/actions/workflows/test.yml)
[![codecov](https://img.shields.io/codecov/c/github/FlorianPallas/monzod)](https://codecov.io/gh/FlorianPallas/monzod)
[![npm weekly downloads](https://img.shields.io/npm/dw/monzod)](https://www.npmjs.com/package/monzod)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/monzod)](https://bundlephobia.com/package/monzod)
[![license](https://img.shields.io/github/license/FlorianPallas/monzod)](https://img.shields.io/github/license/FlorianPallas/monzod)

## Installation

Monzod is available on npm and can be installed with your favorite package manager. It requires MongoDB and Zod as peer dependencies.

```sh
npm  install monzod mongodb zod
pnpm install monzod mongodb zod
yarn add     monzod mongodb zod
```

## Usage

> :warning: Monzod is still in early development and the API is subject to change. Expect breaking changes [even for minor version bumps](https://semver.org/#spec-item-4). Use at your own risk. Data loss may occur.

### Models

The idea behind using Zod together with MongoDB is to have a type safe interface to the database. This requires all data that is put into the database to be validated beforehand. This is where Zod comes in. Zod is a TypeScript-first schema declaration and validation library. It allows you to define a schema for our entities and validate them.

Monzod provides a few additions that make this process easier. A basic model definition could look like this:

```ts
import { mz } from "monzod";

// Define your schema once!
export const bookSchema = z.object({
  _id: mz.objectId(), // Monzod adds support for BSON types within your schemas
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
});

export type Book = z.infer<typeof bookSchema>; // Zod allows you to infer the type from the schema
```

### Mapping

The BSON types that MongoDB uses are ideally kept close to the database layer. We can define a few more objects that use the TypeScript analogues of those types, so we can use them in our application code. But now we have to keep track of even more schemas and convert objects between them.

Most often you will be mapping objectIds to strings. Lets see how we can do that with Monzod.

> :warning: Monzod currently only supports mapping the ObjectId type

```ts
import { mapSchema, mapEntity } from "monzod";

// Mapping schemas

const bookDTO = mapSchema(bookSchema);
type BookDTO = z.infer<typeof bookDTO>;
//    ^? type BookDTO = { id: string; ... }

// Mapping entities

const book = await bookCollection.findOne({ ... });
//     ^? const book: { _id: ObjectId; ... }

const bookDTO = mapEntity(book, bookDTO);
//     ^? const bookDTO: { id: string; ... }

bookDTOSchema.parse(bookDTO); // Mapped entities are compatible with their corresponding schemas
```

But sometimes you want more than just map ids. For example you might want to remove the `author` field in your custom schema. Easy! Just use what you already know about Zod and what you learned above.

```ts
import { mapSchema, mapEntity } from "monzod";

const anonymousBookSchema = mapSchema(bookSchema).omit({ author: true });

const mapAnonymousBook = (book: Book) => {
  const mappedBook = mapEntity(book);
  delete mappedBook.author; // You will probably find a nicer way to do this
  return mappedBook;
}

const book = await bookRepository.findOne({ ... });
const anonymousBook = mapAnonymousBook(book);
```

### Validation

MongoDB is schemaless, but that does not mean that we should not validate our data. In fact, we should validate our data as much as possible. Zod provides validation on the application layer, but we can also validate our data on the database layer. MongoDB provides JSON / BSON schema validation out of the box, preventing invalid state from being persisted.

Monzod uses that existing functionality and provides a way to generate that schema from your models.

> :warning: Schema conversion is limited to only a few types right now. See the section below for all supported types.

```ts
import { bsonSchema } from "monzod";
import { db } from "./db";

// What MongoDB provides

const bookCollection = db.collection<Book>("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "title", "description", "author"],
      properties: {
        _id: { bsonType: "objectId" },
        title: { bsonType: "string" },
        // ...
        // This is tedious and error prone.
        // It is also completely detached from the actual schema.
        // If you miss a field here, your app will error out.
      },
    },
  },
});

// Do this instead

const bookCollection = db.collection<Book>("books", {
  validator: { $jsonSchema: bsonSchema(bookSchema) }, // Let Monzod do the heavy lifting
});
```

#### Supported types

##### Zod

- [x] String
- [x] Number
- [ ] BigInt
- [x] Boolean
- [ ] Date
- [ ] Symbol
- [ ] Array
- [x] Object
- [ ] Union
- [ ] Tuple
- [ ] Record
- [ ] Map
- [ ] Set
- [ ] Function
- [ ] Literal
- [ ] Enum
- [ ] NativeEnum
- [x] Optional
- [ ] Nullable

##### BSON

- [x] ObjectId
- [ ] Binary
- [ ] BSONRegExp
- [ ] BSONSymbol
- [ ] Code
- [ ] DBRef
- [ ] Decimal128
- [ ] Double
- [ ] Int32
- [ ] Long
- [ ] MaxKey
- [ ] MinKey
