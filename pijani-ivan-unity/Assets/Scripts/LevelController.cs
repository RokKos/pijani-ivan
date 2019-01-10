using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LevelController : MonoBehaviour
{
    [SerializeField] UiController uiController;
    [SerializeField] GameObject keyPrefab;
    [SerializeField] Transform parent;
    [SerializeField] List<Transform> spawnPoints;
    [SerializeField] string[] levelScenes;


    private Scene mainScene;
    private Scene levelScene;
    private bool levelLoaded = false;

    private int level = 0;

    private List<KeyController> keys;

    void Start()
    {
        mainScene = SceneManager.GetActiveScene();
        LoadLevel();
    }

    void UnloadLevel()
    {
        if (levelLoaded)
        {
            SceneManager.UnloadSceneAsync(levelScene);
            levelLoaded = false;
        }
    }

    void LoadLevel()
    {
        UnloadLevel();
        string s = levelScenes[level];

        SceneManager.LoadScene(s, LoadSceneMode.Additive);
        levelScene = SceneManager.GetSceneByName(s);
        levelLoaded = true;

        SceneManager.SetActiveScene(mainScene);
    }

    public void NextLevel()
    {
        level += 1;
        if (level < levelScenes.Length)
        {
            LoadLevel();
        }
        else
        {
            GameController.Instance.GameWon();
        }
    }

    public void OpenGates(KeyController key) {
        keys.Remove(key);
        uiController.DisplayOpenGates();
    }
}
