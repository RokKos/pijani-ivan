using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BulletPoolController : MonoBehaviour
{
    [SerializeField] BulletController prefab;
    [SerializeField] GameObject poolSceneParent;

    private Queue<BulletController> pool;
    private const int kBulletsNumber = 100;

    // Start is called before the first frame update
    void Start()
    {
        pool = new Queue<BulletController>(kBulletsNumber);
        for (int i = 0; i < kBulletsNumber; ++i) {
            BulletController bullet = (BulletController)Instantiate(prefab, poolSceneParent.transform);
            pool.Enqueue(bullet);
        }
    }
}
