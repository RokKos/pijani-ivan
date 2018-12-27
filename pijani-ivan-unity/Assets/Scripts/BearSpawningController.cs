using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BearSpawningController : MonoBehaviour
{
    [SerializeField] List<Transform> spawnPoints;
    [SerializeField] MedvedController bearPrefab;
    [SerializeField] Transform bearsParent;
    [SerializeField] Transform player;

    private List<MedvedController> bears;

    // Start is called before the first frame update
    void Start()
    {
        bears = new List<MedvedController>();
        foreach (Transform spawnPoint in spawnPoints) {
            MedvedController bear = Instantiate(bearPrefab, spawnPoint.position, Quaternion.identity, bearsParent);
            bear.SetPlayerTransform(player);
            bears.Add(bear);
        }
    }
}
