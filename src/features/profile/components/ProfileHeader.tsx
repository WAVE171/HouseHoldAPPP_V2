import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { UserProfile } from '../types/profile.types';

interface ProfileHeaderProps {
  profile: UserProfile;
  onUploadAvatar: (file: File) => Promise<string>;
}

export function ProfileHeader({ profile, onUploadAvatar }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onUploadAvatar(file);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'PARENT':
        return 'default';
      case 'MEMBER':
        return 'secondary';
      case 'STAFF':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="text-center sm:text-left space-y-2">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <h1 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h1>
          <Badge variant={getRoleBadgeVariant(profile.role)}>
            {profile.role}
          </Badge>
        </div>
        <p className="text-muted-foreground">{profile.email}</p>
        <p className="text-sm text-muted-foreground">
          Member of <span className="font-medium">{profile.householdName}</span> since {formatDate(profile.joinedAt)}
        </p>
        {profile.bio && (
          <p className="text-sm max-w-md">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}
