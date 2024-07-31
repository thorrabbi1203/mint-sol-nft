import {
  Keypair,
  Transaction,
  Connection,
  PublicKey,
  clusterApiUrl,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as bs58 from "bs58";
const PRIVATE_KEY = "";
async function transfer() {
  // connection to Solana.
  const connection = new Connection(clusterApiUrl("devnet"));

  // Payer of new ATA.
  const feePayer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

  // Previous owner of Token or NFT
  const prevOwner = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
  // Mint address of the NFT.
  const mintPubkey = new PublicKey(
    "GsW3Us6fFUVAP8FAbvERJVJ5qB7abKZRC2iFDXdKuBEc"
  );
  // Recipient of the NFT.
  const receiveAdress = new PublicKey(
    "GsW3Us6fFUVAP8FAbvERJVJ5qB7abKZRC2iFDXdKuBEc"
  );
  // Original Token Account
  const tokenAccount1Pubkey = new PublicKey(
    "CSMGsjmq3QZUsdXqTzmEKDUxUYe2iGAAaVtyY81JSan5"
  );
  let ata = await getAssociatedTokenAddress(
    mintPubkey, // mint
    receiveAdress // owner
  );
  // Create transfer instruction to from the previous ATA owned by old wallet, to new ATA.
  const tokenAccount2Pubkey = new PublicKey(ata);
  let tx = new Transaction();
  tx.add(
    // creatAss(),
    createTransferCheckedInstruction(
      tokenAccount1Pubkey, // from
      mintPubkey, // mint
      tokenAccount2Pubkey, // to
      prevOwner.publicKey, // from's owner
      1, // amount
      0 // decimals
    )
  );
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165,
    },
    {
      memcmp: {
        offset: 32,
        bytes: feePayer.publicKey.toBase58(),
      },
    },
  ];
  const tokenAccount = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters,
    }
  );
  tokenAccount.forEach((account, i) => {
    const parsedAccountInfo = account.pubkey.toString();

    console.log(
      parsedAccountInfo,
      //@ts-ignore
      account.account.data?.parsed?.info?.tokenAmount?.uiAmount
    );
  });
  // Send Transaction here.
  // console.log(
  //   `txhash: ${await connection.sendTransaction(tx, [feePayer, prevOwner])}`
  // );
}

transfer();
