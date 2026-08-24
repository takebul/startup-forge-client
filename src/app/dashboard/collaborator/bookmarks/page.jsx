import { getBookmarksById } from "@/lib/api/bookmarks";
import { getUserSession } from "@/lib/core/session";
import BookmarkedPage from "./BookmarkedPage";

export const metadata = {
  title: "Saved Bookmarks — StartupForge Dashboard",
  description:
    "Review and apply to startup role opportunities you have saved for later.",
};

const BookmarkedPageWrapper = async () => {
  const user = await getUserSession();
  const userId = user?.id || user?._id;

  const rawBookmarks = userId ? await getBookmarksById(userId) : [];

  return (
    <div>
      <BookmarkedPage initialBookmarks={rawBookmarks} user={user} />
    </div>
  );
};

export default BookmarkedPageWrapper;

