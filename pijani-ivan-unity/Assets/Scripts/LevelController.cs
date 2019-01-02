using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelController : MonoBehaviour
{
    [SerializeField] UiController uiController;
    [SerializeField] GameObject keyPrefab;
    [SerializeField] Transform parent;
    [SerializeField] List<Transform> spawnPoints;

    private List<KeyController> keys;

    void Start()
    {
        keys = new List<KeyController>();

        foreach (Transform key_pos in spawnPoints) {
            GameObject keyObj = Instantiate(keyPrefab, key_pos.position, Quaternion.identity, parent);
            KeyController key = keyObj.GetComponentInChildren<KeyController>();
            key.SetLevelController(this);
            keys.Add(key);
        }
    }


    public void OpenGates(KeyController key) {
        keys.Remove(key);
        uiController.DisplayOpenGates();
    }
}
