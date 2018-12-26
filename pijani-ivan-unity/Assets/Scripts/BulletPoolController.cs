using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BulletPoolController : MonoBehaviour
{
    [SerializeField] BulletController prefab;
    [SerializeField] Transform poolSceneParent;
    [SerializeField] Transform gameSceneParent;

    private Queue<BulletController> pool;
    private const int kBulletsNumber = 50;
    private Vector3 farAwayVector = new Vector3(10000, 10000, 10000);

    // Start is called before the first frame update
    void Start()
    {
        pool = new Queue<BulletController>(kBulletsNumber);
        for (int i = 0; i < kBulletsNumber; ++i) {
            BulletController bullet = (BulletController)Instantiate(prefab, farAwayVector, Quaternion.identity, poolSceneParent);
            bullet.name = System.String.Format("Bullet {0:D2}", i);
            bullet.gameObject.SetActive(false);
            bullet.SetBulletPoolController(this);
            pool.Enqueue(bullet);
        }
    }

    public BulletController GetBullet() {
        BulletController bullet = pool.Dequeue();
        ResetBullet(bullet, true, gameSceneParent);
        return bullet;
    }

    public void ReturnBullet(BulletController bullet) {
        ResetBullet(bullet, false, poolSceneParent);
        pool.Enqueue(bullet);
    }

    private void ResetBullet(BulletController bullet, bool activate, Transform parent) {
        bullet.transform.SetParent(parent);
        if (!activate) {
            bullet.transform.position = farAwayVector;
        } else {
            bullet.transform.position = Vector3.zero;
        }
        
        bullet.gameObject.SetActive(activate);
    }
}
