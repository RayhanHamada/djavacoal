# Feature

## Gallery Feature

You are a senior full-stack engineer and architect.

---

# Feature Specification

## 1. Feature Title

Charcoal Product list

## 2. Goal / Objective

- As dashboard user i want to see list of my product list so that i can search, reorder and manage them
- as a dashboard user i want to be to create a new product
- as a dashboard user i want to be to edit existing product content

## 3. Stack & Environment

- existing stack should be already specified from the github instruction
- The object storage to store the assets will be using cloudflare R2
- for drag and drop use react dnd kit, install it using `bun`

## 4. In-Scope vs Out-of-Scope

**In Scope:**

- List products menu with filtering by product name and actions button to delete and hide the product. the card is ordered and can be arranged by drag and drop to change order
- product create and edit page

## 5. Functional Requirements (Flow & User Interactions)

- List product menu (`/dashboard/products`), consist of:
    - Search box to search charcoal product by name (english)
    - A 4 column grid of ordered product cards consist of product name (english). Each product cards should have proper actions button to delete and toggle product visibility. The photo should use the first photo of the media.
    - The cards can also be drag and dropped to arrange their orders. When clicked it should redirect user to edit product page
- Somewhere in list product menu there should be a create product button, position preferably to be on the same level as search box
- A create product menu (`/dashboard/products/create`), with the following field:
    - english product name (required)
    - arabic product name (required)
    - english product description (required, use rich text editor)
    - arabic product description (required, use rich text editor)
    - List of media where each media item can be the following:
        - Simple photo, show the photo
        - Youtube video link, (should save the ID only) and its should show thumbnail either one of these
            - by default uses video’s own thumbnail (available through [https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)),
            - or can be specified by uploading photo.
            
            make the items to be card component and the card component should be drag and drop so the item can be reordered
            
    - List of specification photo, should be portrait and able to be drag and dropped for reordering
    - List of product variants consist of:
        - A photo, preferably square aspect ratio
        - english name (free text)
        - arabic name (free text)
        - english description (free text)
        - arabic description (free text)
    - MOQ (free text)
    - Production Capacity (free text)
    - Packaging options should be a multiselect field with suggestion value comes from `packaging_options` data. The
- An edit product menu (`/dashboard/products/<product_id>/edit`), the fields should be same as create product menu with every field is editable

## 6. Non-Functional Requirements

- Make sure only authenticated user can do this
- file upload should be done from user’s browser, so what backend or server actions is doing is just create a presigned url for user to upload photo.
- Photo uploads must be done when user submitting the form
- The style should follows mantine UI spec and existing theme of the app
- Implement using clean code and atomic design principles, makes no mistakes and add comment to explain what the code does when necessary

## 7. Data & Models

- The schema definitions and relations already defined using drizzle in the `schema.ts` file somewhere in `adapters` folder.

## 8. Environment Variables & Configuration

- the cloudflare binding for R2 storage is `DJAVACOAL_BUCKET`
- if additional package install is needed, use bun package manager, through `bun i` command

## 9. Edge Cases & Error States

- Whenever API fails or Server actions fails, add proper notifications using mantine UI

---

## Prompt

Now implement this feature spec.

Produce **production-ready TypeScript code** for both frontend & backend where applicable.

Ensure it fits the stack and runtime constraints above.

Do not write any extra unrelated features.

At the end, provide a summary of what was built, key design decisions, and how error handling & edge cases are covered in 1 readme file.

---