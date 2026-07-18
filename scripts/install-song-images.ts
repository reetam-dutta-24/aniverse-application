import { copyFileSync, mkdirSync } from "fs";
import path from "path";
import { MUSIC_ITEMS } from "../lib/seed/generate-catalog";

const ASSET_DIR =
  "C:\\Users\\dutta\\.cursor\\projects\\c-Users-dutta-OneDrive-Desktop-aniverse-app\\assets";

/** Upload batch: image 1 = content; song covers start at image 2 in catalog order. */
const UPLOADED_SONG_ASSETS = [
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-164205f3-fe4e-45ac-87a8-5d9dca7f4c9f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-c92fcf31-10ce-4d90-ac1c-33a32afafed9.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-0be9a98b-9a4f-4cab-ab60-4d97ba6ed12a.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-d30efefa-6993-4a67-be60-d2af57d76ff7.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-4309daf8-a547-4c04-a8a8-a65845657c97.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-83fcfc77-819e-4192-9de6-7de82bc0247e.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-66291a80-0e20-40e6-be07-532b4ca33d7f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-679d5561-d031-4f23-8555-a1a8ab867e0d.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-74402abb-c4e8-4fae-9af7-13098b526067.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-f06c3035-2c7b-4b5c-9d39-d5bea844596f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-eadbcef8-a374-49e3-8d3a-bfbec27945ab.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-a519701e-5c84-46ff-908d-d5b7a500b0ab.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-3357c6af-abcd-4b34-8002-472f792c3ebe.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-227126bc-7b94-4729-b67b-e6aca687ca06.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-472e6a08-8c4c-4b95-9e09-a86acd29298a.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-0c7c995e-17a2-49e3-ae6c-36960a3ac45b.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-e093c3ea-ec2b-4d45-84c1-5e1581c7d2b0.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-f51c2b13-d43d-4758-b7e5-9c06a28a3951.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-3d946ea1-c25d-4a45-8a77-84f662ac3a01.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-086442d6-c48e-4f6d-9036-43960dcc5922.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-7b42d4ef-4d1c-465e-aad2-eeb0ae9c301a.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-136ca222-5535-4ce2-9296-29711f0e580f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-32065177-498a-424d-a5bc-b30a8f30678c.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-f44bdbb9-6bf0-4cc7-a34e-cc99ed79e55e.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-2173257e-70d0-442b-9e0a-7f968a472d07.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-d3e60de1-f662-4560-91f9-4cc8df769417.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-65895b25-ddcc-45ce-9fc8-92eec0d02f25.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-02aef089-b037-4151-8425-324aa897c3ee.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-6e4bada9-e211-4b79-94b6-deb4a85534be.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-fc76fa66-13be-48c1-91f3-4f3533d5877b.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-06101a0a-4582-43cb-8ee8-2809c24eedfb.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-bdb5459b-5363-4467-a0fc-9bb34a5b5084.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-51b86574-3933-4e1a-ad11-777d52e398d4.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-9be3f9ed-a6d7-43c1-b074-c9fd368c75bd.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-ee4f5f23-ec7a-4aee-b84d-1cb87d018a03.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-1f16b14d-c1bc-4fd0-9f9b-5f13e43aa00c.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-580d2633-20e1-4072-a869-d54d5358e79a.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-1d372d2f-8b98-4569-b610-f71cb5ad7560.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-3086a6fd-c367-4d23-a3d7-8710f7f1d071.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-19c22790-1dbd-4197-9e5a-4a6f1a13e94c.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-01b8e725-2408-4052-aeb6-d1b36916521d.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-02e78b9b-791d-4efe-b642-5d85ece6e74f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-cbbfa69f-3f96-4d0e-bffa-2c2293c353fe.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-5c674372-b4fe-4fc7-ae9a-50ea3d910b35.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-a5bc7e27-7954-4522-91d8-46bcaebb8d0f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-fdf41c9c-e5ba-42d2-8127-701236c3d0a5.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-f08667d0-6dbd-4a68-848e-09a9dc68c8e6.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-209a7dda-22e1-418f-856e-d8378bcf0d32.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-ce0b1f73-487c-4e64-ad38-ec438b5d32da.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-6102f623-8ad7-4f71-b0db-f961f75c70ce.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-fc1b5b1c-b6fe-4a14-b1e4-bce58c7d793e.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-e901a08a-e5f5-46a3-b943-3938101293e8.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-ebfb6588-83b4-489b-b8f7-99f166bdec28.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-5d01cdea-686e-4db1-9abc-10a68cd69c89.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-dd681480-c32b-4d2e-8e7c-373457f1257b.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-71f99055-33f5-4263-8fb9-18ddf983a28c.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-3dfa2e05-8816-4b36-838a-1b3e1ba9850e.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-5b9441f6-3be9-4015-bcfd-9f200fe2fd01.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-dbffafbe-f6cd-4fe0-be49-d19e55111650.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-ffa195d2-c7f2-4c8c-b37a-df42c6b1026a.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-c92822d2-40c9-4e0b-a37a-823d3058386f.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-301d8f40-0b7c-4391-a299-697f29ae8579.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-1b1b86b5-cc07-45c4-8a59-be792b6150a3.png",
  "c__Users_dutta_AppData_Roaming_Cursor_User_workspaceStorage_48facbd20ca94b438a946e31774be69c_images_image-5680b1bd-129d-4632-830c-6b25b2e677f9.png",
] as const;

const destDir = path.join(process.cwd(), "public", "images", "music");
mkdirSync(destDir, { recursive: true });

if (UPLOADED_SONG_ASSETS.length !== MUSIC_ITEMS.length) {
  throw new Error(
    `Expected ${MUSIC_ITEMS.length} song images, got ${UPLOADED_SONG_ASSETS.length}`,
  );
}

for (let i = 0; i < MUSIC_ITEMS.length; i++) {
  const track = MUSIC_ITEMS[i]!;
  const src = path.join(ASSET_DIR, UPLOADED_SONG_ASSETS[i]!);
  const dest = path.join(destDir, `${track.slug}.png`);
  copyFileSync(src, dest);
  console.log(`${i + 1}. ${track.artist} — ${track.title} -> ${track.slug}.png`);
}

console.log(`Installed ${MUSIC_ITEMS.length} song covers.`);
