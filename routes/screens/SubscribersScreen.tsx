import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import AddMemberScreen from "./AddMemberScreen";
import MemberDetailsScreen from "./MemberDetailsScreen";
import LabelHeaderNav from "../../components/LabelHeaderNav";
import type { MemberFormValues } from "../../components/MemberForm";
import MemberListCard from "../../components/MemberListCard";
import { commonStyles } from "../../components/commonStyles";
import type { Member } from "../../models/Member";
import { useSubscribersViewModel } from "../../viewmodels/useSubscribersViewModel";

export default function SubscribersScreen() {
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
      <LinearGradient
        colors={["#F59E0B", "#FFC107"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <LabelHeaderNav
          label="Subscribers"
          onNavigate={() => setIsAdding(true)}
        />
        <Searchbar
          placeholder="Search members"
          onChangeText={setQuery}
          style={[commonStyles.searchBar, styles.searchBar]}
          inputStyle={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          value={query}
        />
      </LinearGradient>
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
              <IconButton icon="chevron-right" size={22} style={styles.chevron} />
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
  header: {
    height: "28%",
    justifyContent: "flex-end",
    paddingHorizontal: 32,
    paddingBottom: 24,
    gap: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 12,
  },
  searchBar: {
    width: "100%",
  },
  searchInput: {
    color: "#374151",
  },
  listWrapper: {
    width: "100%",
    flex: 1,
  },
  chevron: {
    margin: 0,
  },
});
