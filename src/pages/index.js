import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
import BookImageUrl from '@site/static/img/eksbook-cover.png';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">

          <div className={clsx('col col--4')}>
            <div className="text--center">
                <img src={BookImageUrl} />;
            </div>
          </div>
          <div className={clsx('col col--8')}>
            <Heading as="h1" className={styles.heroTitle} >
              那些文件沒有告訴你的 AWS EKS
            </Heading>
            <Heading as="h2" className={styles.fontBlack}>
              {siteConfig.tagline}
            </Heading>
            <hr />
            <Heading as="h3" className={styles.fontBlack}>
              立即購買
            </Heading>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="https://www.drmaster.com.tw/bookinfo.asp?BookID=MP22342">
                博碩
              </Link>
            </div>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="https://www.tenlong.com.tw/products/9786263337145">
                天瓏書局
              </Link>
            </div>
            <div className={styles.fontBlack} >
              <p>
              本書內容改編自第 14 屆 iThome 鐵人賽 DevOps 組的優選系列文章《那些文件沒告訴你的 AWS EKS》。
              本書從建立 EKS cluster 開始，由「為什麼」為引言反思 AWS 是如何引用原生 Kubernetes 功能並設計，並溯源 Kubernetes 的原理，進而學習底層 Linux 及網路相關知識。此外，每章節提供逐步除錯驗證，照著步驟實作也能學習到除錯概念。
              </p>
              <p>
              全書提供 18 個「為什麼」，使用「五個為什麼（Five whys）方法論一層層從 AWS、Kubernetes、容器，最終至作業系統，沿著因果關係順著網上探討釐清整體脈絡。這些「為什麼」們包含了數個 EKS 上實務常見問題，讀者除了能熟悉 AWS 環境及 Kubernetes 限制，也同時釐清作業系統與網路脈絡，提升問題排除的能力，進而持續精進「打破砂鍋問到底」的研究精神
              </p>
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout>
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
