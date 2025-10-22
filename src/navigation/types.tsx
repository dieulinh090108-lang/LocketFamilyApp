export type MainStackParamList = {
  Home: undefined;
  CreateGroup: undefined;
  JoinGroup: undefined;
  GroupScreen: { groupId: string; groupName: string };
};

export type RootStackParamList = {
  Walkthrough: undefined;
  Login: undefined;
  Register: undefined;
  Main: { screen: keyof MainStackParamList; initial?: boolean } | undefined;
};