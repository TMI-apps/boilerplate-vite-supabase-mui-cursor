import { useAuthContext } from "@/shared/context/AuthContext";
import { useSupabaseConfig } from "@/shared/hooks/useSupabaseConfig";
import { useUserProfileQuery } from "@/features/auth/hooks/useUserProfileQuery";
import { ProfileMenuContent } from "./ProfileMenu/ProfileMenuContent";
import { ProfileMenuTrigger } from "./ProfileMenu/ProfileMenuTrigger";
import { getMenuProps } from "@/shared/utils/menuConfig";
import { useProfileMenuHandlers } from "@/features/auth/hooks/useProfileMenuHandlers";
import { useProfileMenuState } from "@/features/auth/hooks/useProfileMenuState";

import Menu from "@mui/material/Menu";

interface ProfileMenuProps {
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
}

/**
 * ProfileMenu component for displaying user account information and sign-in options.
 * Shows sign-in buttons when user is not logged in, and profile/logout when logged in.
 */
export const ProfileMenu = ({
  anchorEl: externalAnchorEl,
  onClose: externalOnClose,
}: ProfileMenuProps) => {
  const { user } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useUserProfileQuery(user?.id ?? null);
  const { isConfigured: supabaseConfigured } = useSupabaseConfig();

  const { anchorEl, open, handleClick, handleClose } = useProfileMenuState({
    externalAnchorEl,
    externalOnClose,
  });

  const { handleSignIn, handleGoToLogin, handleSignOut } = useProfileMenuHandlers({
    onClose: handleClose,
  });

  const menuContent = (
    <ProfileMenuContent
      isLoggedIn={user !== null}
      supabaseConfigured={supabaseConfigured}
      user={user}
      profile={profile ?? null}
      profileLoading={profileLoading}
      onSignInWithGoogle={handleSignIn}
      onGoToLogin={handleGoToLogin}
      onSignOut={handleSignOut}
    />
  );

  const menuProps = getMenuProps(anchorEl, open, handleClose);

  if (!externalAnchorEl) {
    return (
      <>
        <ProfileMenuTrigger
          user={user}
          profile={profile ?? null}
          onClick={handleClick}
          open={open}
        />
        <Menu {...menuProps}>{menuContent}</Menu>
      </>
    );
  }

  return <Menu {...menuProps}>{menuContent}</Menu>;
};
