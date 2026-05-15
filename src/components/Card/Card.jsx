import axios from "axios";
import { useNavigate } from "react-router";

export default function Card(props) {
  const { post, user, onPostDeleted } = props;
  const navigate = useNavigate();
  const isOwner = user?.user?.id === post.userId;

  async function handleDelete() {
    if (!user?.accessToken || !isOwner) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/${post.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      onPostDeleted?.(post.id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  }

  function handleEdit() {
    if (!isOwner) return;

    navigate("/manage-posts", {
      state: {
        post,
      },
    });
  }

  return (
    <div className="card card-compact bg-base-100 border border-base-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <figure className="h-72 overflow-hidden rounded-t-2xl">
        <img
          src={post.image}
          className="h-full w-full object-cover"
          alt="Blog post"
        />
      </figure>
      <div className="card-body">
        <div className="flex flex-col gap-3">
          <h2 className="card-title text-2xl">{post.title}</h2>
          <p className="text-base-content/80 line-clamp-3">{post.description}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="badge badge-outline badge-md">{post.user.name}</span>
          {user && isOwner && (
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-sm btn-secondary" onClick={handleEdit}>
                Edit
              </button>
              <button type="button" className="btn btn-sm btn-error btn-outline" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
