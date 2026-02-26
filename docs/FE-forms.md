# Form Architectural Summary

In React, forms are managed using controlled components. This means the application is responsible for storing each field’s value in state and updating that state whenever the user makes a change.

Validation logic is typically triggered on blur (when the user leaves a field). To support this, the form must track which fields have been touched, execute the relevant validation rules, and surface any errors when necessary. Validation feedback should stay fully synchronized with the UI—for example, clearly indicating which fields are invalid.

In addition, forms need to support internationalization (so labels, messages, and errors are translated correctly) and accessibility (proper labeling, ARIA attributes, and clear error associations).

Finally, the form must produce the correct submission payload structure so it integrates cleanly with Next.js server actions or API handlers.

---

A form is constructed by layering:

1. Contract and validation layer (Zod schema)
2. UI metadata layer (fields blueprint)
3. State engine layer (`useForm`)
4. Presentation layer (TextField + Form components)
5. Submission layer (server action guard)

# Forms Utilities Documentation

This module provides a lightweight, type-safe form state hook built on top of Zod.

It centralizes the state management of:

- Form values
- Touched state (blur tracking)
- Field-level errors
- Submit-time validation

---

# useForm

## Purpose

`useForm` manages:

- `values`
- `touched`
- `errors`
- `setValue`
- `setTouch`
- `validateBeforeSubmit`

Errors are only shown for touched fields, unless a full submit validation is triggered.

---

# Validation Utilities

## validate

- Runs `schema.safeParse(values)`
- Returns only errors for touched fields
- Flattens Zod field errors

---

## validateAll

- Marks all fields as touched
- Then delegates to `validate`

---

# Design Notes

- Errors only appear after blur (`setTouch`) or full submit.
- Zod is the single source of truth.
- `fieldNames` keeps validation scope explicit.
- Fully type-safe without external form libraries.
- Easy to integrate with custom UI components (TextField, etc.).

---


