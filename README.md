# Redux Code Generator

An application to generate redux code based on initial states.

[Site]

<hr />

## The problem

You love redux where everything is simple and explicit, but you hates to write so many codes just to do a operation. Introducing abstration may reduce the code, but it is no longer simple and explicit.

## This solution

This is a web application that takes your reducer default state as input, and produces the following codes:

1. `action-keys` - the constants to shared between your actions and reducer
2. `actions` - all the action creators
3. `reducer` - the reducer
4. `selectors` - selectors to query data from your store
5. `unit tests` - Jest unit tests that test action creators, reducer, and selectors together

## Usage

1. Enter your initial state json into the "Initial State" text field. All the code will be generated!
1. If you would like to prefix your store/actions/reducer, use the "Store Prefix" field.

## Limitations

1. It is assumed that the initial state is a plain object (not array).
1. It is fine to have array in your state, but this application could not handle another array as descendent of array. (It is bad practice to have such redux store anyway).

## Future Enhancement (WIP)

- Typescript support
- Test framework other than Jest

[site]: https://redux-code-generator.netlify.com/
