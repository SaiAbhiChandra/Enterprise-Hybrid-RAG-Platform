import {

    Navigate,

} from "react-router-dom";

import { useAuth } from "../auth/useAuth";

type Props = {

    children: React.ReactNode;

};

export default function ProtectedRoute({

    children,

}: Props) {

    const {

        isAuthenticated,

    } = useAuth();

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    return <>

        {children}

    </>;

}