import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import AddMemberScreen from "./AddMemberScreen";
import MemberDetailsScreen from "./MemberDetailsScreen";
import SearchNavbar from "../../components/SearchNavbar";
import type { MemberFormValues } from "../../components/MemberForm";
import MemberListCard from "../../components/MemberListCard";
import type { Member } from "../../models/Member";
import { useSubscribersViewModel } from "../../viewmodels/useSubscribersViewModel";

type SubscribersScreenProps = {
  onBack: () => void;
};

export default function SubscribersScreen({ onBack }: SubscribersScreenProps) {
  const {
    members,
    query,
    setQuery,
    loading,
    error,
    editingMember,
    startEditing,
    cancelEditing,
    submitMember,
    removeMember,
  } = useSubscribersViewModel();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  const closeForm = () => {
    setIsAdding(false);
    cancelEditing();
  };

  const handleSubmit = async (values: MemberFormValues) => {
    await submitMember(values);
    setIsAdding(false);
  };

  if (isAdding || editingMember) {
    return (
      <AddMemberScreen
        editingMember={editingMember}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />
    );
  }

  if (viewingMember) {
    return (
      <MemberDetailsScreen
        member={viewingMember}
        onBack={() => setViewingMember(null)}
        onEdit={() => {
          setViewingMember(null);
          startEditing(viewingMember);
        }}
        onDelete={() => {
          removeMember(viewingMember);
          setViewingMember(null);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchNavbar
        title="Subscribers"
        onBack={onBack}
        onAddPress={() => setIsAdding(true)}
        onBellPress={() => {}}
        searchPlaceholder="Search members"
        query={query}
        onQueryChange={setQuery}
      />
      <View style={styles.content}>
        <View style={styles.listWrapper}>
          <MemberListCard
            title="Subscribers"
            members={members}
            query={query}
            onQueryChange={setQuery}
            loading={loading}
            error={error}
            showSearchBar={false}
            onItemPress={(member) => setViewingMember(member)}
            renderRight={() => (
              <IconButton icon="chevron-right" size={22} iconColor="#C4C7CC" style={styles.chevron} />
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
  chevron: {
    margin: 0,
  },
});
