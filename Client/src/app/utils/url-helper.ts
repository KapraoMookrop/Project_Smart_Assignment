export function getDisplayableUrl(url: string | undefined): string {
  if (!url || url.trim() === '') return 'https://www.atimedesign.com/webdesign/wp-content/uploads/2018/03/1.jpg';
  
  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    const driveIdRegex = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/|lh\d+\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(driveIdRegex);
    
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  
  return url;
}
