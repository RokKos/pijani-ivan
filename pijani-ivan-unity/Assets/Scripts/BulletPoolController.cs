using System.Collections.Generic;
using UnityEngine;

public class BulletPoolController : MonoBehaviour
{
    [SerializeField] BulletController bulletPrefab;
    [SerializeField] MolotovController molotovPrefab;
    [SerializeField] Transform poolSceneParent;
    [SerializeField] Transform gameSceneParent;

    private Queue<BulletController> poolBullets;
    private const int kBulletsNumber = 50;

    private Queue<MolotovController> poolMolotov;
    private const int kMolotovNumber = 5;
    private Vector3 farAwayVector = new Vector3(10000, 10000, 10000);

    // Start is called before the first frame update
    void Start()
    {
        poolBullets = new Queue<BulletController>(kBulletsNumber);
        for (int i = 0; i < kBulletsNumber; ++i) {
            BulletController bullet = (BulletController)Instantiate(bulletPrefab, farAwayVector, Quaternion.Euler(0,0,90), poolSceneParent);
            bullet.name = System.String.Format("Bullet {0:D2}", i);
            bullet.gameObject.SetActive(false);
            bullet.SetPoolController(this);
            poolBullets.Enqueue(bullet);
        }

        poolMolotov = new Queue<MolotovController>(kMolotovNumber);
        for (int i = 0; i < kMolotovNumber; ++i) {
            MolotovController molotov = (MolotovController)Instantiate(molotovPrefab, farAwayVector, Quaternion.identity, poolSceneParent);
            molotov.name = System.String.Format("Molotov {0:D2}", i);
            molotov.gameObject.SetActive(false);
            molotov.SetPoolController(this);
            poolMolotov.Enqueue(molotov);
        }
    }

    public BulletController GetBullet() {
        BulletController bullet = poolBullets.Dequeue();
        ResetPoolObject(bullet, true, gameSceneParent);
        return bullet;
    }

    public void ReturnBullet(BulletController bullet) {
        ResetPoolObject(bullet, false, poolSceneParent);
        poolBullets.Enqueue(bullet);
    }

    public MolotovController GetMolotov() {
        MolotovController molotov = poolMolotov.Dequeue();
        ResetPoolObject(molotov, true, gameSceneParent);
        return molotov;
    }

    public void ReturnMolotov(MolotovController molotov) {
        ResetPoolObject(molotov, false, poolSceneParent);
        poolMolotov.Enqueue(molotov);
    }

    private void ResetPoolObject(PoolObjectController poolObject, bool activate, Transform parent) {
        poolObject.transform.SetParent(parent);
        if (!activate) {
            poolObject.transform.position = farAwayVector;
        } else {
            poolObject.transform.position = Vector3.zero;
        }

        poolObject.gameObject.SetActive(activate);
        poolObject.ResetRigitBody();
        
    }
}
