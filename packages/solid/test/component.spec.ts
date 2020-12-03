import { createComponent, assignProps, splitProps, createState } from "../src";

type SimplePropTypes = {
  a?: string | null;
  b?: string | null;
  c?: string | null;
  d?: string | null;
};

const Comp = (props: { greeting: string; name: string }) => `${props.greeting} ${props.name}`;

const Comp2 = (props: { greeting: string; name: string, optional?: string }) => {
  const [p, q] = splitProps(props, ["greeting", "optional"]);
  return `${p.greeting} ${q.name}`;
}

describe("CreateComponent", () => {
  test("create simple component", () => {
    const out = createComponent(Comp, { greeting: "Hi", get name() { return "dynamic" }});
    expect(out).toBe("Hi dynamic");
  });
});

describe("Set Default Props", () => {
  test("simple set", () => {
    let props: SimplePropTypes = {
        get a() {
          return "ji";
        },
        b: null,
        c: "j"
      },
      defaults: SimplePropTypes = { a: "yy", b: "ggg", d: "DD" };
    props = assignProps(defaults, props);
    expect(props.a).toBe("ji");
    expect(props.b).toBe(null);
    expect(props.c).toBe("j");
    expect(props.d).toBe("DD");
  });
});

describe("Clone Props", () => {
  test("simple set", () => {
    let reactive = false;
    const props: SimplePropTypes = {
      get a() {
        reactive = true;
        return "ji";
      },
      b: null,
      c: "j"
    };
    const newProps = assignProps({}, props);
    expect(reactive).toBe(false);
    expect(newProps.a).toBe("ji");
    expect(reactive).toBe(true);
    expect(newProps.b).toBe(null);
    expect(newProps.c).toBe("j");
    expect(newProps.d).toBe(undefined);
  });
});

describe("Clone State", () => {
  const [state, setState] = createState<{a: string, b: string, c?: string}>({ a: "Hi", b: "Jo" });
  const clone = assignProps({}, state);
  expect(clone.a).toBe("Hi");
  expect(clone.b).toBe("Jo");
  setState({ a: "Greetings", c: "John" });
  expect(clone.a).toBe("Greetings");
  expect(clone.b).toBe("Jo");
  expect(clone.c).toBe(undefined);
})

describe("SplitProps Props", () => {
  test("SplitProps in two", () => {
    const out = createComponent(Comp2, { greeting: "Hi", get name() { return "dynamic"; }});
    expect(out).toBe("Hi dynamic");
  })
});
