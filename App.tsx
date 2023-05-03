import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Contacts from 'react-native-contacts';

export default function Example() {
  const [contacts, setContacts] = React.useState<Contacts.Contact[] | null>(
    null,
  );
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'ContactsList app would like to access your contacts.',
        buttonPositive: 'Accept',
      }).then(value => {
        if (value === 'granted') {
          Contacts.getAll().then(setContacts);
        }
      });
    } else {
      Contacts.getAll().then(setContacts);
    }
  }, []);

  const sections = React.useMemo(() => {
    if (!contacts) {
      return null;
    }

    const sectionsMap = contacts.reduce<Record<string, Contacts.Contact[]>>(
      (acc, contact) => {
        const {familyName} = contact;
        const [firstLetter] = familyName;

        return Object.assign(acc, {
          [firstLetter]: [...(acc[firstLetter] || []), contact],
        });
      },
      {},
    );

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.familyName.localeCompare(b.familyName)),
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [contacts]);

  if (!sections) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={{backgroundColor: '#f2f2f2'}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Contacts</Text>
        </View>

        {sections.map(({letter, items}) => (
          <View style={styles.section} key={letter}>
            <Text style={styles.sectionTitle}>{letter}</Text>
            <View style={styles.sectionItems}>
              {items.map(
                (
                  {givenName, familyName, phoneNumbers, thumbnailPath},
                  index,
                ) => {
                  const name = `${givenName} ${familyName}`;
                  const phone = phoneNumbers.length
                    ? phoneNumbers[0].number
                    : '-';
                  const img = thumbnailPath;

                  return (
                    <View key={index} style={styles.cardWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          // handle onPress
                        }}>
                        <View style={styles.card}>
                          {img ? (
                            <Image
                              alt=""
                              resizeMode="cover"
                              source={{uri: img}}
                              style={styles.cardImg}
                            />
                          ) : (
                            <View style={[styles.cardImg, styles.cardAvatar]}>
                              <Text style={styles.cardAvatarText}>
                                {name[0]}
                              </Text>
                            </View>
                          )}

                          <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{name}</Text>

                            <Text style={styles.cardPhone}>{phone}</Text>
                          </View>

                          <View style={styles.cardAction}>
                            <FeatherIcon
                              color="#9ca3af"
                              name="chevron-right"
                              size={22}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                },
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sectionItems: {
    marginTop: 8,
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
  cardAction: {
    paddingRight: 16,
  },
});
