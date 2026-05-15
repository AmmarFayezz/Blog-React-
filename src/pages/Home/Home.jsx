import { Link } from "react-router";
import Card from "../../components/Card/Card";

export default function Home(props) {
  const { posts, loading, onPostDeleted, user } = props;

  return (
    <div className="bg-base-200 min-h-screen pb-24">
      <section className="bg-primary text-primary-content py-16">
        <div className="container max-w-3xl text-center space-y-4">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-content/70">
            Simple blog experience
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">Share your ideas with the community</h1>
          <p className="mx-auto max-w-2xl text-base text-primary-content/85">
            Browse posts, add your own content, and manage everything from one clean dashboard.
          </p>
        </div>
      </section>

      <main className="container max-w-4xl px-0 py-10 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : posts.length === 0 ? (
          <div className="card bg-base-100 border border-base-200 shadow-md p-10 text-center">
            <p className="text-lg text-base-content/70">No posts yet. Login to add the first one.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              post={post}
              user={user}
              onPostDeleted={onPostDeleted}
            />
          ))
        )}
      </main>

      {user && (
        <Link
          to="manage-posts"
          className="fixed bottom-6 right-6 btn btn-primary btn-circle btn-xl shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
