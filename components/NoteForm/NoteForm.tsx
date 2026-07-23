"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteApi } from "@/lib/api";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Minimum length is 3 characters")
    .max(50, "Maximum length is 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Maximum length is 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (err) => {
      console.error("Error creating note:", err);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema: NoteSchema,
    onSubmit: (values) => {
      // Передаємо об'єкт строго за структурой вашого API
      mutation.mutate({
        title: values.title.trim(),
        content: values.content.trim(),
        tag: values.tag,
      });
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      {/* Поле Title */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        <span className={css.error}>
          {formik.touched.title && formik.errors.title ?
            formik.errors.title
          : ""}
        </span>
      </div>

      {/* Поле Content */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
        />
        <span className={css.error}>
          {formik.touched.content && formik.errors.content ?
            formik.errors.content
          : ""}
        </span>
      </div>

      {/* Поле Tag */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error}>
          {formik.touched.tag && formik.errors.tag ? formik.errors.tag : ""}
        </span>
      </div>

      {/* Кнопки дій */}
      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
