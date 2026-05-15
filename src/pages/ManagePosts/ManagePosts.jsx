import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";

export default function ManagePosts({ onPostSaved }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const postToEdit = location.state?.post || null;
  const isEditing = Boolean(postToEdit?.id);
  const isOwner = user?.user?.id === postToEdit?.userId;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/register");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    if (postToEdit && user && !isOwner) {
      navigate("/");
    }
  }, [isOwner, navigate, postToEdit, user]);

  const schema = yup.object({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 chars"),

    description: yup
      .string()
      .required("Description is required")
      .min(10, "Description must be at least 10 chars"),

    image: yup
      .string()
      .required("imageURL is required")
      .url("Invalid image URL"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: "",
    },

    validationSchema: schema,

    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        if (!user || !user.accessToken) {
          setError("Authentication required");
          navigate("/register");
          return;
        }

        if (isEditing && !isOwner) {
          setError("You can only edit your own posts");
          navigate("/");
          return;
        }

        const newPost = {
          title: values.title,
          description: values.description,
          image: values.image,
          userId: user.user.id,
        };

        let savedPost;

        if (isEditing) {
          const response = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/posts/${postToEdit.id}`,
            newPost,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            },
          );
          savedPost = {
            ...response.data,
            user: postToEdit.user || user.user,
          };
        } else {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/posts`,
            newPost,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            },
          );
          savedPost = {
            ...response.data,
            user: user.user,
          };
        }

        formik.resetForm();
        setError("");
        onPostSaved?.(savedPost);
        navigate("/", { replace: true });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            `Failed to ${isEditing ? "update" : "create"} post`,
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!postToEdit) return;

    formik.setValues({
      title: postToEdit.title || "",
      description: postToEdit.description || "",
      image: postToEdit.image || "",
    });
  }, [postToEdit]);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-base-200 min-h-screen py-16">
      <div className="container max-w-2xl px-0">
        <div className="card bg-base-100 border border-base-200 shadow-xl">
          <div className="card-body p-8">
            <h2 className="text-center text-3xl font-bold mb-4">
              {isEditing ? "Edit Post" : "New Post"}
            </h2>
            {error && <p className="text-sm text-error text-center mb-4">{error}</p>}
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="title" className="font-semibold">
                  Title
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  id="title"
                  placeholder="Post title"
                  value={formik.values.title}
                  name="title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.errors.title && formik.touched.title && (
                  <p className="text-sm text-error">*{formik.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="font-semibold">
                  Description
                </label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[120px]"
                  id="description"
                  placeholder="Write a short description"
                  value={formik.values.description}
                  name="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="text-sm text-error">*{formik.errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="image" className="font-semibold">
                  Image URL
                </label>
                <input
                  className="input input-bordered w-full"
                  type="url"
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={formik.values.image}
                  name="image"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.errors.image && formik.touched.image && (
                  <p className="text-sm text-error">*{formik.errors.image}</p>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Post" : "Add Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
