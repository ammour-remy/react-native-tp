import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ButtonType = 'validate' | 'delete' | 'edit' | 'back' | 'add' | 'photo';


declare type Props = {
    title?: string,
    width?: number,
    onPress: () => void,
    type?: ButtonType,
    icon: keyof typeof FontAwesome.glyphMap,
    iconOnly?: boolean,
};

export default function Button({ title, width, onPress, type = 'validate', icon, iconOnly = false }: Props) {
    const colorScheme = useColorScheme() || 'light';

    const getButtonStyle = () => {
        return { backgroundColor: Colors[colorScheme][type] };
    }

    const iconColor = Colors[colorScheme].iconColor;

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.button,
                getButtonStyle(),
                iconOnly && styles.iconOnlyButton,
                width && !iconOnly ? { width } : {},
            ]}
        >
            {icon && <FontAwesome name={icon} size={20} color={iconColor} />}
            {!iconOnly && title && <Text style={styles.textButton}>{title}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    iconOnlyButton: {
        paddingHorizontal: 8,
        minWidth: 40,
    },
    textButton: {
        color: 'white',
        marginLeft: 8,
    }
});
