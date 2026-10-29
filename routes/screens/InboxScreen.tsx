import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import SearchNavbar from "../../components/SearchNavbar";
import NotificationListCard from "../../components/NotificationListCard";
import { useNotificationsViewModel } from "../../viewmodels/useNotificationsViewModel";

// Top-level tab: the right-hand navbar button marks everything read; tapping a row toggles read/unread.
export default function InboxScreen() {
  const {
    notifications,
    query,
    setQuery,
    loading,
    error,
    toggleRead,
    markAllRead,
    removeNotification,
  } = useNotificationsViewModel();

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Inbox"
        rightIcon="email-check-outline"
        onAddPress={markAllRead}
        searchPlaceholder="Search notifications"
        query={query}
        onQueryChange={setQuery}
      />
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <NotificationListCard
            notifications={notifications}
            loading={loading}
            error={error}
            emptyLabel={query ? "No notifications found." : "Your inbox is empty."}
            onItemPress={toggleRead}
            renderRight={(item) => (
              <IconButton
                icon="trash-can-outline"
                size={22}
                iconColor="#C4C7CC"
                onPress={() => removeNotification(item)}
                style={styles.action}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 12,
  },
  listWrapper: {
    width: "100%",
    flex: 1,
  },
  action: {
    margin: 0,
  },
});
