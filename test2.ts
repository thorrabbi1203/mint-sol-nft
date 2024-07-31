import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

async function getNFTsFromTokenAccounts() {
  const connection = new Connection("https://api.devnet.solana.com");
  const walletPublicAddress = "GsW3Us6fFUVAP8FAbvERJVJ5qB7abKZRC2iFDXdKuBEc";

  // Lấy danh sách tài khoản token liên kết với địa chỉ ví
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165,
    },
    {
      memcmp: {
        offset: 32,
        bytes: walletPublicAddress,
      },
    },
  ];
  const tokenAccounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters,
    }
  );
  // Lọc ra các tài khoản token liên quan đến NFT

  // Lấy thông tin chi tiết về mỗi NFT
  tokenAccounts.forEach(async (account, i) => {
    //@ts-ignore
    const mintAddress = account.account.data.parsed.info.mint;

    // Use the Token class to get mint information
    const mint = await getAssociatedTokenAddress(
      new PublicKey(mintAddress),
      new PublicKey(walletPublicAddress)
    );

    console.log("NFT Mint:", "");
    console.log("Owner:", walletPublicAddress);
    console.log(
      "Balance:",
      //@ts-ignore
      account.account.data.parsed.info.tokenAmount.uiAmount
    );

    // Bạn có thể thêm các thông tin khác tùy thuộc vào cần thiết
    console.log("Additional Info:", mint);
    console.log("---------------------------------");
    console.log(account.account.data);
  });
}

getNFTsFromTokenAccounts();
