import { describe, expect, expectTypeOf, test } from "vitest";
import { ZodObject, z } from "zod";
import { TaggedKeys, omitTag, pickTag, tag } from "./tag";

const user = z.object({
  name: tag(z.string(), "foo"),
  age: tag(z.number(), "foo"),
  password: z.string(),
});

const post = z.object({
  title: tag(z.string(), "foo"),
  content: z.string(),
  user: tag(user, "foo"),
});

const book = z.object({
  title: tag(z.string(), "foo"),
  content: z.string(),
  author: user,
});

test("tag", () => {
  expect(user.shape.name._def.tag).toEqual("foo");
  expectTypeOf(user.shape.name._def.tag).toEqualTypeOf<"foo">();
});

describe("pick tag", () => {
  test("picks properties", () => {
    expect(pickTag(user, "foo").shape).toStrictEqual({
      name: user.shape.name,
      age: user.shape.age,
    });
    expectTypeOf(pickTag(user, "foo").shape).toEqualTypeOf<{
      name: typeof user.shape.name;
      age: typeof user.shape.age;
    }>();
  });

  test("picks nested properties", () => {
    const mappedType = pickTag(post, "foo");

    expect(mappedType.shape).toStrictEqual({
      title: post.shape.title,
      user: expect.any(ZodObject),
    });

    expect(mappedType.shape.user.shape).toStrictEqual({
      name: user.shape.name,
      age: user.shape.age,
    });

    expectTypeOf(mappedType.shape).toMatchTypeOf<{
      title: typeof post.shape.title;
      user: z.ZodObject<{
        name: typeof user.shape.name;
        age: typeof user.shape.age;
      }>;
    }>();
  });

  test("omits empty nested objects", () => {
    const user = z.object({
      id: tag(z.string(), "foo"),
      nested: z.object({
        name: z.string(),
      }),
    });

    const mappedUser = pickTag(user, "foo");

    expect(mappedUser.shape).toStrictEqual({
      id: user.shape.id,
    });

    expectTypeOf(mappedUser.shape).toEqualTypeOf<{
      id: typeof user.shape.id;
    }>();
  });
});

describe("omit tag", () => {
  test("omits properties", () => {
    expect(omitTag(user, "foo").shape).toStrictEqual({
      password: user.shape.password,
    });
    expectTypeOf(omitTag(user, "foo").shape).toEqualTypeOf<{
      password: typeof user.shape.password;
    }>();
  });

  test("omits nested properties", () => {
    const mappedType = omitTag(book, "foo");

    expect(mappedType.shape).toStrictEqual({
      content: book.shape.content,
      author: expect.any(ZodObject),
    });

    expect(mappedType.shape.author.shape).toStrictEqual({
      password: user.shape.password,
    });

    expectTypeOf(mappedType.shape).toMatchTypeOf<{
      content: typeof book.shape.content;
      author: z.ZodObject<{
        password: typeof user.shape.password;
      }>;
    }>();
  });

  test("omits empty nested objects", () => {
    const user = z.object({
      id: z.string(),
      name: tag(z.string(), "foo"),
      nested: z.object({
        name: tag(z.string(), "foo"),
      }),
    });

    const mappedUser = omitTag(user, "foo");

    expect(mappedUser.shape).toStrictEqual({
      id: user.shape.id,
    });

    expectTypeOf(mappedUser.shape).toEqualTypeOf<{
      id: typeof user.shape.id;
    }>();
  });
});
