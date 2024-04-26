import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.eventerra',
    projectId: '662bc55d00015218b556',
    databaseId: '662bc9c500073bd75a4c',
    userCollectionId: '662bc9f1000836bdc8c8',
    videoCollectionId: '662bca76003b78478e14',
    storageId: '662bcc790028b3e894f5'
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new  Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

      if(!newAccount) throw Error;

      const avatarUrl = avatars.getInitials(username)

      await signIn(email, password);
      
      const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
      )
      
      return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}