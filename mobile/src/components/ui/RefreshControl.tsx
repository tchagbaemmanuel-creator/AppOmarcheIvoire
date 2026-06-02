import React from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';
import { Theme } from '@/config/constants';

interface RefreshControlProps {
    refreshing: boolean;
    onRefresh: () => void;
}

const RefreshControl: React.FC<RefreshControlProps> = ({ refreshing, onRefresh, ...props }) => {
    return (
        <RNRefreshControl
            colors={[Theme.colors.green]}
            tintColor="white"
            refreshing={refreshing}
            enabled={true}
            onRefresh={onRefresh}
            style={{ backgroundColor: Theme.colors.green }}
            progressBackgroundColor={"white"}
            progressViewOffset={0}
            {...props}
        />
    );
};

export default RefreshControl;