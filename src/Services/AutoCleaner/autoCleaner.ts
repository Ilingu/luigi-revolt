import { ExecGraphQL } from "../../lib/db/nhost";
import { IsGqlReqSucceed } from "../../lib/db/utils";
import { ImageToDeleteShape } from "../../lib/types/types";
import { acDeleteImages } from "./bot";
import {
  GQL_DELETE_IMAGES_BY_MESSAGES_IDS,
  GQL_QUERY_ALL_IMAGES,
} from "./graphql/schema";

/**
 * Entry point -- Check all image in deletion queue and deleted the expired one
 */
export const CheckAndDeleteExpiredImage = async (): Promise<void> => {
  try {
    const [QUERY_ALL_IMAGES, GqlFunc] = GQL_QUERY_ALL_IMAGES;

    // Query all row on the "ImgToDelete" table
    const resp = await ExecGraphQL<ImageToDeleteShape[]>(QUERY_ALL_IMAGES);
    const success = IsGqlReqSucceed(resp, GqlFunc);

    // Checking that all went good
    const PotentialImagesToDelete = resp?.data && resp.data[GqlFunc];
    if (
      !success ||
      !PotentialImagesToDelete ||
      (PotentialImagesToDelete || []).length <= 0
    )
      return;

    // Filtering the Expired Raws
    const ImagesToDelete = PotentialImagesToDelete.filter(
      ({ expire_timestamp }) => expire_timestamp <= Date.now()
    );

    // Converting [{ img1, ch1 }, { img2, ch2 }, { img3, ch1 }] to { ch1: [img1, img3], ch2: [img2] }
    const MsgIDsToDeleteByChannel: { [K: string]: string[] } = {};
    ImagesToDelete.forEach(({ channel, message_id }) => {
      MsgIDsToDeleteByChannel[channel] = [
        ...(MsgIDsToDeleteByChannel[channel] || []),
        message_id,
      ];
    });

    Object.keys(MsgIDsToDeleteByChannel).forEach((chId) => {
      const channelMessagesToDel = MsgIDsToDeleteByChannel[chId];
      acDeleteImages(chId, channelMessagesToDel); // deletes the channel's expired images
    });

    // Once deleted on revolt we can now delete it on the DB
    const [DELETE_IMAGES] = GQL_DELETE_IMAGES_BY_MESSAGES_IDS(
      ImagesToDelete.map(({ message_id }) => message_id)
    );
    await ExecGraphQL(DELETE_IMAGES);
  } catch (err) {
    console.error(err);
  }
};
