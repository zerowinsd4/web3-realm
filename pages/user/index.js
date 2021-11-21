import { LoadingUI } from "@/components/loading";
import NftImage from "@/components/nft-image";
import ReadableTx from "@/components/readable-tx";
import { Button, Card, Grid } from "@geist-ui/react";
import { follow } from "@store/ceramicStore";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";
import { useCeramicContext } from "../../contexts/CeramicContext";
import { useBalance } from "../../hooks/useBalance";
import { useEnsData } from "../../hooks/useEnsData";
import { fetcher } from "../../lib/fetcher";

export default function Profile() {
  const web3Context = useWeb3React();
  const { library, chainId } = web3Context;
  const { client } = useCeramicContext();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { address } = router.query;
  const [mounted, setMounted] = React.useState(false);
  const queryParams = new URLSearchParams({ address });

  const { ens, url, avatar } = useEnsData({ provider: library, address });

  const balance = useBalance({ account: address, library, chainId });
  //const api_route = `/api/nft/account?${queryParams}`;

  const { data, error } = useSWR(
    mounted ? `/api/address-txs/?address=${address}` : null,
    fetcher
  );
  const txsData = data ? data.data.items : [];

  React.useEffect(() => {
    setMounted(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleFollowButtonClick = (e) => {
    e.preventDefault();
    console.log(
      "button click with client",
      client,
      "resolved address",
      address
    );
    follow(client, address);
  };
  if (error) return <div>Failed to load users</div>;
  if (!data || loading)
    return (
      <div>
        Loading... <LoadingUI />
      </div>
    );

  return (
    <Grid.Container gap={2} justify="center" height="100%" width="70%">
      <Grid xs={12}>
        <Grid.Container gap={2} justify="center" width="70%">
          <Grid xs={24}>

            <NftImage avatar={avatar} />
          </Grid>
          <Grid xs={12}>
            <Button auto loading={loading} onClick={handleFollowButtonClick}>
              Follow
            </Button>
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid xs={12}>
        <Card shadow width="100%">
          <pre>balance:{balance}</pre>
          <pre>site: {url}</pre>
          <pre> {JSON.stringify(data, null, 2)}</pre>
        </Card>
      </Grid>
      <Grid xs={24}>
        <ReadableTx datetime="" cost="" />
        {/* <Card shadow width="100%" height="50px">
          {JSON.stringify(data)}
        </Card> */}
      </Grid>
      <Grid>placeholder</Grid>
    </Grid.Container>
  );
};