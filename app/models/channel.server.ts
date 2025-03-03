import type { Channel, ChannelItem, Image, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Channel } from "@prisma/client";

export function addUserToChannel({
  id,
  userId,
}: Pick<Channel, "id"> & { userId: User["id"] }) {
  return prisma.channel.update({
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
    where: {
      id,
    },
  });
}

export function createChannel({
  description,
  image,
  items,
  link,
  origin,
  title,
  userId,
}: Pick<Channel, "description" | "link" | "origin" | "title"> & {
  image?: Pick<Image, "link" | "title" | "url">;
  items: Pick<
    ChannelItem,
    "description" | "guid" | "link" | "pubDate" | "title"
  >[];
  userId: User["id"];
}) {
  return prisma.channel.create({
    data: {
      description,
      image:
        image?.link && image?.title && image?.url
          ? {
              create: {
                ...image,
              },
            }
          : undefined,
      items: {
        createMany: {
          data: items,
        },
      },
      link,
      origin,
      title,
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function createChannelImage({
  link,
  title,
  url,
}: Pick<Image, "link" | "title" | "url">) {
  return prisma.image.create({
    data: {
      link,
      title,
      url,
    },
  });
}

export function deleteChannel({ id }: Pick<Channel, "id">) {
  return prisma.channel.deleteMany({
    where: { id },
  });
}

export function deleteChannelImage({ id }: Pick<Image, "id">) {
  return prisma.image.deleteMany({
    where: { id },
  });
}

export function getChannel({ id }: { id: Channel["id"] }) {
  return prisma.channel.findUnique({
    include: {
      _count: {
        select: {
          items: true,
        },
      },
      image: true,
    },
    where: { id },
  });
}

export function getChannels() {
  return prisma.channel.findMany({
    select: {
      id: true,
      items: {
        select: {
          _count: true,
        },
      },
      title: true,
      users: {
        select: {
          _count: true,
        },
      },
    },
  });
}

export function getChannelsToUpdate() {
  return prisma.channel.findMany({
    include: {
      _count: {
        select: {
          users: true,
        },
      },
      image: {
        select: { id: true, url: true },
      },
      items: {
        select: { guid: true, link: true, pubDate: true, title: true },
      },
    },
  });
}

export function getChannelsForUserId({ userId }: { userId: User["id"] }) {
  return prisma.channel.findMany({
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { title: "asc" },
    where: { users: { some: { id: userId } } },
  });
}

export function getChannelForOrigin({ origin }: { origin: Channel["origin"] }) {
  return prisma.channel.findFirst({
    orderBy: { title: "asc" },
    where: { origin },
  });
}

export function getUnsubscribedChannelsForUserId({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.channel.findMany({
    select: {
      description: true,
      id: true,
      image: true,
      link: true,
      origin: true,
      title: true,
      users: {
        select: {
          _count: true,
        },
      },
    },
    take: 10,
    where: {
      users: {
        every: {
          id: {
            not: userId,
          },
        },
      },
    },
  });
}

export function removeUserFromChannel({
  id,
  userId,
}: Pick<Channel, "id"> & { userId: User["id"] }) {
  return prisma.channel.update({
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
    where: {
      id,
    },
  });
}

export function updateChannel({
  data: { description, image, items, link, title },
  id,
}: {
  data: Pick<Channel, "description" | "link" | "title"> & {
    image?: Pick<Image, "link" | "title" | "url">;
    items: Pick<ChannelItem, "description" | "link" | "pubDate" | "title">[];
  };
  id: Channel["id"];
}) {
  return prisma.channel.update({
    data: {
      description,
      image:
        image?.link && image?.title && image?.url
          ? {
              create: {
                ...image,
              },
            }
          : undefined,
      items: {
        createMany: {
          data: items,
        },
      },
      link,
      title,
    },
    where: {
      id,
    },
  });
}
