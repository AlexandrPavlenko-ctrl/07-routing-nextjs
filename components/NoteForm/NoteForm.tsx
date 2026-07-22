import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteApi, CreateNoteInput } from "../../lib/api";
import css from "./NoteForm.module.css";

const ALLOWED_TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;
type AllowedTag = (typeof ALLOWED_TAGS)[number];

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: AllowedTag | "";
}

const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content cannot exceed 500 characters")
    .notRequired(),
  tag: Yup.string()
    .oneOf([...ALLOWED_TAGS], "Invalid tag selection")
    .required("Tag is required"),
});

export const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const initialValues: NoteFormValues = { title: "", content: "", tag: "" };

  const handleSubmit = (
    values: NoteFormValues,
    { setSubmitting }: FormikHelpers<NoteFormValues>,
  ): void => {
    mutate(values as CreateNoteInput, {
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h3>Create Note</h3>

          {/* Поле Title */}
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              className={css.input}
              placeholder="Enter title"
            />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          {/* Поле Content */}
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              className={css.textarea}
              placeholder="Enter content (optional)"
            />
            <ErrorMessage
              name="content"
              component="div"
              className={css.error}
            />
          </div>

          {/* Поле Tag */}
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="" disabled>
                Select a tag
              </option>
              {ALLOWED_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          {/* Кнопки дій */}
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isSubmitting || isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
