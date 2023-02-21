export const mockEventDetailMaker = ({
  name,
  key
}: {
  name: string;
  key: string;
}) => ({
  bucket: {
    name
  },
  object: {
    key
  }
});
