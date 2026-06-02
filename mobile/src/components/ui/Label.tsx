import { ButtonContainer } from "@/components/Button";
import { Theme } from "@/config/constants";
import { TouchableOpacityProps } from "react-native";
interface LabelContainerProps extends TouchableOpacityProps {

}
export function LabelContainer(props: LabelContainerProps) {
    return (
        <ButtonContainer
            {...props}
            style={[{ backgroundColor: Theme.colors.greenLight, height: 42, paddingHorizontal: 12, width: 'auto' }, props.style]} />
    );
}